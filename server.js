const express = require('express');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/api/scripts', (req, res) => {
    const targetsPath = path.join(__dirname, 'targets.json');
    if (!fs.existsSync(targetsPath)) return res.json([]);
    const data = JSON.parse(fs.readFileSync(targetsPath, 'utf-8'));
    res.json(data);
});

app.post('/api/run', async (req, res) => {
    const { type, name } = req.body;
    const targetsPath = path.join(__dirname, 'targets.json');
    if (!fs.existsSync(targetsPath)) return res.status(400).send('Missing targets.json');

    const allTargets = JSON.parse(fs.readFileSync(targetsPath, 'utf-8'));
    const target = allTargets.find(t => t.name === name && t.type === type);
    if (!target) return res.status(404).send('Script not found');

    let browser, page, log = [];
    try {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.goto(target.url, { waitUntil: 'networkidle2' });

        for (const line of target.commands) {
            const [cmd, content] = line.split('====');
            if (!cmd || !content) continue;
            const [selector, value] = content.split('::');

            log.push(`Executing: ${cmd} on ${selector}`);
            if (cmd === 'click') {
                await page.click(selector.trim());
            } else if (cmd === 'input_fill2') {
                await page.type(selector.trim(), 'test_value');
            } else if (cmd === 'click_form_submit') {
                await page.$eval(selector.trim(), form => form.submit());
            }
            await page.waitForTimeout(500);
        }

        await browser.close();
        return res.json({ success: true, log });
    } catch (err) {
        if (browser) await browser.close();
        return res.json({ success: false, log: log.concat('Error: ' + err.message) });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});