# Auto Login Scripter (v2)

## Как работи:
1. Добави сайт и настройки в `targets.json`
2. Стартирай скрипта: `node generateLoginScript.js`
3. Резултатът ще се появи в папка `output/`

## Поддържани команди:
- click
- input_fill
- input_fill2
- click_form_submit

## Пример:
```json
{
  "url": "https://example.com",
  "username": "demo",
  "password": "demo123",
  "allowed_commands": ["click", "input_fill2", "click_form_submit"]
}
```