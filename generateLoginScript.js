const fs = require('fs');

function generateScript(target) {
    const commands = target.allowed_commands;
    const lines = [];
    if (commands.includes("click")) {
        lines.push(`click====#login-button`);
    }
    if (commands.includes("input_fill2")) {
        lines.push(`input_fill2====#username::{user_name}`);
        lines.push(`input_fill2====#password::{password}`);
    }
    if (commands.includes("click_form_submit")) {
        lines.push(`click_form_submit====form.login-form`);
    } else if (commands.includes("click")) {
        lines.push(`click====button[type='submit']`);
    }
    return lines.join("\n");
}

const targets = JSON.parse(fs.readFileSync("targets.json"));
targets.forEach((target, i) => {
    const script = generateScript(target);
    const outPath = `output/script_${i + 1}.txt`;
    fs.mkdirSync("output", { recursive: true });
    fs.writeFileSync(outPath, script);
    console.log(`Script saved to ${outPath}`);
});