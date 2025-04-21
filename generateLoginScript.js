const fs = require('fs');

function generateScript(target) {
    const commands = target.allowed_commands;
    const lines = [];

    // Изчакване за първоначално зареждане на страницата (10 секунди)
    lines.push(`wait====10000`);

    if (commands.includes("click")) {
        lines.push(`click====#login-button`);
        lines.push(`wait====10000`);  // изчакване след първи клик (10 сек.)
    }

    if (commands.includes("input_fill2")) {
        lines.push(`input_fill2====#username::{user_name}`);
        lines.push(`wait====10000`);  // изчакване след въвеждане на username (10 сек.)
        lines.push(`input_fill2====#password::{password}`);
        lines.push(`wait====10000`);  // изчакване след въвеждане на парола (10 сек.)
    }

    if (commands.includes("click_form_submit")) {
        lines.push(`click_form_submit====form.login-form`);
        lines.push(`wait====10000`);  // изчакване след изпращане на формата (10 сек.)
    } else if (commands.includes("click")) {
        lines.push(`click====button[type='submit']`);
        lines.push(`wait====10000`);  // изчакване след алтернативно изпращане на формата (10 сек.)
    }

    return lines.join("\n");
}

const targets = JSON.parse(fs.readFileSync("targets.json"));
targets.forEach((target, i) => {
    const script = generateScript(target);
    const outPath = `output/script_${i + 1}.txt`;
    fs.mkdirSync("output", { recursive: true });
    fs.writeFileSync(outPath, script
