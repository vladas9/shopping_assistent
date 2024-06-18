console.log("content script running");
// function handleElementChange(mutationsList, observer) {

// }

function twoDimToObj(mat) {
    let obj = {};
    mat.forEach(item => {
        let key = item[0];
        let value = item[1];
        obj[key] = value;
    });
    return obj;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
    if(message.type == "analysis") {
        const entries = Object.keys(message);
        const table = document.getElementsByClassName("a-normal a-spacing-micro")[0].children[0].children;
        for(const entry of table) {
            const [ td1, td2 ] = entry.children;
            if(entries.includes(td1.children[0].textContent)) {
                const t = td2.children[0];
                t.textContent = message[td1.children[0].textContent];
                t.classList.add("a-size-mini");
                t.classList.add("a-color-state");
                t.classList.add("a-text-bold");
            }
        }
    } else if(message.type == "suggestion") {
        const divs = [...document.getElementsByTagName("div")];
        for(const div of divs) {
            const id = div.getAttribute("data-uuid");
            if(!id) {
                div.removeAttribute("style");
                continue;
            };

            if(!Object.values(message.ids).includes(id)) {
                div.removeAttribute("style");
                continue;
            }

            div.style.background = "#FF000040";
            console.log(div);
        }
        // for(const id of Object.values(message.ids)) {
        //     const div = divs.find(e => e.getAttribute("data-uuid") == id);
        //     // div.classList.add("a-box-inner");
        //     // const temp = div.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0];
        //     // const title = temp.children[0].children[0].children[0].children[0];
        //     // (title as HTMLElement).style.color = "red";
        //     // div.style.borderColor = "red";
        //     div.style.background = "#FF000040";
        //     console.log(div);
        // }
    } else if(message.type == "selection") {
        console.log("sendind selection");
        chrome.runtime.sendMessage(window.getSelection().toString());
    } else if(message.type == "definition") {
        console.log("message", message);
        document.body.innerHTML = document.body.innerHTML.split(message.definition).join(`${message.definition} <span data-hook="avp-badge-linkless" class="a-size-mini a-color-state a-text-bold">(${message.content})</span>`);
    }
    // document.body.innerHTML = document.body.innerHTML.replaceAll()
})

function getFirstChild(el, n) {
    if(n == 0) return el;

    return getFirstChild(el.children[0], n - 1);
}

async function handleElementChange(firstTime) {
    console.log("LOaded");

    if(firstTime) await chrome.storage.local.set({});

    const scrapeObj = await chrome.storage.local.get("scrapeData");

    let scrapeData = {};

    if(window.location.href.includes("/dp/") ) {
        //One item
        let tableData  = window.location.href.includes("/dp/") 
        ? twoDimToObj([...document.getElementsByTagName("table")[0].tBodies[0].children]
        .map(c => [...c.children]
        .map(d => (d as HTMLElement).innerText))) 
        : null;

        const totalRating = document.getElementById("acrPopover").children[0].children[0].children[0].textContent.trim();
        const detailedRating = window.location.href.includes("/dp/") ? twoDimToObj(
            [...document.getElementById("histogramTable")?.children[0].children]
            .map((c, i) => ( [ `${5 - i} star`, c.children[2].children[1].textContent]))
        ) : null;

        let i = 0;
        let btn = document.getElementById(`aspect-button-0-${i}`);
        let criteria = {};
        while(btn != null) {
            if(!btn.getAttribute("aria-describedby")) {
                btn = null;
                continue;
            }

            const [ desc, crit ] = btn.getAttribute("aria-describedby").split(' aspect ');
            // Object.defineProperty(criteria, crit, { value: desc.toLowerCase() });
            criteria[crit] = desc.toLowerCase();
            // criteria[crit] = desc.toLowerCase();
            i++;
            btn = document.getElementById(`aspect-button-0-${i}`);
        }

        scrapeData = {
            title: document.getElementById("productTitle")?.innerText,
            table: tableData,
            criteria,
            rating: totalRating,
            detailedRating
            // features
        }
    } else if(!window.location.href.includes("/cart/")) {
        //Item list
        let list = {};
        for(const el of document.getElementsByClassName("s-widget-spacing-small")) {
            const id = el.getAttribute("data-uuid");
            const temp = el.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0];
            const title = temp.children[0].children[0].children[0].children[0].textContent;
            const rating = temp.children[1].children[0].children[0].getAttribute("aria-label").split(" ")[0];
            const price = temp.children[2].children[0].children[0].children[2].children[0].getElementsByClassName("a-color-base")[0].textContent;
            list[id] = { title, rating, price };
        }
        scrapeData = {
            list
        }
    } else {
        //Shopping cart
        let i = 0;
        let items = {};
        for(const t of document.getElementsByClassName("sc-grid-item-product-title")) {
            if(i % 2 != 0) {
                i++;
                continue;
            }

            
            items[i / 2] = {}
            items[i / 2]["Title"] = t.children[0].children[0].textContent;
            i++;
        }

        i = 0;
        for(const p of [...document.getElementsByClassName("sc-product-price")]) {
            items[i]["Price"] = (p as HTMLElement).innerText;
            i++;
        }
        
        i = 0;
        for(const table of [...document.getElementsByClassName("sc-grid-content-tail")]) {
            const lis = [...table.children].filter(e => e.className.includes("sc-product-variation"));
            for(const l of lis) {
                const [ prop, val ] = [...l.children[0].children] as HTMLElement[];
                items[i][prop.innerText] = val.innerText;
            }
            i++;
        }
        scrapeData = {
            items
        }
    }

    
    if(scrapeObj.scrapeData.scrapeData) {
        delete scrapeObj.scrapeData.scrapeData
    }
    if((scrapeData as any).scrapeData) {
        delete (scrapeData as any).scrapeData.scrapeData;
    }
    console.log("scrapeData", scrapeData);
    console.log("crapeObj.scrapeData", scrapeObj.scrapeData);
    scrapeData = {
        ...scrapeObj.scrapeData,
        ...scrapeData,
    }
    console.log("after",scrapeData);

    chrome.storage.local.set({ scrapeData: scrapeData });

    // table.forEach(item => {
    //     let key = item[0];
    //     let value = item[1];
    //     tableData[key] = value;
    // });

    // let features = [...([...document.getElementById("feature-bullets").children].find(c => c.nodeName.toLowerCase() == "ul")).children].map(c => (c as HTMLElement).innerText)

    // const totalRating = document.getElementById("acrPopover").children[0].children[0].children[0].textContent.trim();
    // const detailedRating = window.location.href.includes("/dp/") ? twoDimToObj(
    //     [...document.getElementById("histogramTable")?.children[0].children]
    //     .map((c, i) => ( [ `${5 - i} star`, c.children[2].children[1].textContent]))
    // ) : null;

    // let i = 0;
    // let btn = document.getElementById(`aspect-button-0-${i}`);
    // let criteria = {};
    // while(btn != null) {
    //     const [ desc, crit ] = btn.getAttribute("aria-describedby").split(' aspect ');
    //     // Object.defineProperty(criteria, crit, { value: desc.toLowerCase() });
    //     criteria[crit] = desc.toLowerCase();
    //     // criteria[crit] = desc.toLowerCase();
    //     i++;
    //     btn = document.getElementById(`aspect-button-0-${i}`);
    // }

    // let list = {};
    // if(!window.location.href.includes("/dp/")) {
    //     for(const el of document.getElementsByClassName("s-widget-spacing-small")) {
    //         const id = el.getAttribute("data-uuid");
    //         const temp = el.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0];
    //         const title = temp.children[0].children[0].children[0].children[0].textContent;
    //         const rating = temp.children[1].children[0].children[0].getAttribute("aria-label").split(" ")[0];
    //         const price = temp.children[2].children[0].children[0].children[2].children[0].getElementsByClassName("a-color-base")[0].textContent;
    //         list[id] = { title, rating, price };
    //     }
    // }

    // let scrapeData = {
    //     title: document.getElementById("productTitle")?.innerText,
    //     table: tableData,
    //     criteria,
    //     rating: totalRating,
    //     detailedRating,
    //     list
    //     // features
    // }
}

window.addEventListener("load", () => handleElementChange(true), false);

// This stuff might be useful to track a certain element on the webpage
const observer = new MutationObserver(handleElementChange);
const observerConfig = { attributes: true, childList: true, subtree: true };

const board = document.getElementById("sc-active-cart");
if (board) {
    observer.observe(board, observerConfig);
}