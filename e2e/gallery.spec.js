import {test} from '@playwright/test';
test('produce real cron schedule and timezone comparison screenshots',async({page})=>{
 await page.setViewportSize({width:1270,height:760});
 await page.goto('/');
 await page.locator('#timezone').selectOption('America/New_York');
 await page.locator('#compare-zone').selectOption('Asia/Karachi');
 await page.locator('#from').fill('2027-03-12T00:00:00Z');
 await page.locator('#expression').fill('0 9 * * *');
 await page.getByRole('button',{name:/Preview schedule/}).click();
 await page.screenshot({path:'launch-assets/cronpilot-scheduling.png'});
 await page.locator('.results-panel').scrollIntoViewIfNeeded();
 await page.screenshot({path:'launch-assets/cronpilot-timezones.png'});
 await page.goto('/logo.svg');
 await page.locator('svg').screenshot({path:'launch-assets/cronpilot-thumbnail.png'});
});
