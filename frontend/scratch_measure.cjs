const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174');
  
  // Wait a bit for React to render and GSAP to run
  await new Promise(r => setTimeout(r, 2000));

  const result = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    let maxBottom = 0;
    let maxEl = null;

    for (const el of all) {
      if (el.tagName === 'HTML' || el.tagName === 'BODY' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
      
      const rect = el.getBoundingClientRect();
      const absoluteBottom = rect.bottom + window.scrollY;
      
      if (absoluteBottom > maxBottom) {
        maxBottom = absoluteBottom;
        maxEl = {
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          bottom: absoluteBottom,
          height: rect.height
        };
      }
    }
    
    // Also find the footer
    const footer = document.querySelector('footer, #contact');
    const footerRect = footer ? footer.getBoundingClientRect() : null;
    const footerBottom = footerRect ? footerRect.bottom + window.scrollY : null;

    return {
      scrollHeight: document.body.scrollHeight,
      maxElement: maxEl,
      footerBottom: footerBottom
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
