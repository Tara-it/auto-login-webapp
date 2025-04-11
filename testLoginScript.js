const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const scripts = fs.readdirSync('./output').filter(f => f.endsWith('.txt'));
    const results = [];

    for (const file of scripts) {
        const commands = fs.readFileSync(`./output/${file}`, 'utf-8').split('\n');
        let browser, page;
        try {
            browser = await puppeteer.launch({ headless: true });
            page = await browser.newPage();

            for (const line of commands) {
                const [cmd, target] = line.split('====');
                if (!cmd || !target) continue;

                if (cmd === 'click') {
                    await page.click(target.split('::')[0].trim());
                } else if (cmd === 'input_fill2') {
                    const [selector, value] = target.split('::');
                    await page.type(selector.trim(), 'test_value');
                } else if (cmd === 'click_form_submit') {
                    await page.$eval(target.trim(), form => form.submit());
                }
                await page.waitForTimeout(500);
            }

            results.push(`${file}: SUCCESS`);
            await browser.close();
        } catch (err) {
            results.push(`${file}: FAIL (${err.message})`);
            if (browser) await browser.close();
        }
    }

    fs.writeFileSync('results.log', results.join('\n'), 'utf-8');
    console.log('Тестването завърши. Виж results.log');
})();