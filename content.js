(() => {
    const username = "";
    const password = "";

    const loginTextBox = 'input#loginId';
    const passwordTextBox = 'input#password';
    const answerTextBox = 'input#answer-text';
    const questionText = '#question-text';

    const baseLanguage = 'div.baseLanguage';
    const targetLanguage = 'div.targetLanguage';


    const loginButton = '.btn.btn-primary.btn-login';
    const submitButton = 'button#submit-button';

    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //     if (message === "ping") {
    //         sendResponse({ active: true });
    //     }
    // });

    if (document.querySelector(loginTextBox) != null) document.querySelector(loginTextBox).value = username;
    if (document.querySelector(passwordTextBox) != null) document.querySelector(passwordTextBox).value = password;

    if (document.querySelector(loginButton) != null)    document.querySelector(loginButton).click();

    function waitForAttribute(selector, attribute, value, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element && element.getAttribute(attribute) === value) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 500);

            setTimeout(() => {
                clearInterval(interval);
                
            }, timeout);
        });
    }

    waitForAttribute('body', 'data-package-name', 'mfe-app-shell', 10000);

    console.log("Dashboard Loaded, You are Logged In");

    if(document.querySelector('ep-focus-tracking-popup') != null) document.querySelector('ep-focus-tracking-popup').remove();

    let englishList = [];
    let targetlangList = [];

    function injectScript(code) {
        const script = document.createElement('script');
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    async function answerLoop() {
        let question = document.querySelector(questionText).textContent.replace(/\([^)]*\)/g, "").trim().split(';')[0].trim();
        let answer = englishList[targetlangList.indexOf(question)];
        if (answer == undefined) answer = targetlangList[englishList.indexOf(question)];

        const input = document.querySelector(answerTextBox);
        input.focus();
        input.value = answer;
        input.dispatchEvent(new Event('input', { bubbles: true })); 

        const btn = document.getElementById("submit-button");
        const ngElem = angular.element(btn);
        const scope = ngElem.scope() || ngElem.isolateScope();

        if (scope && scope.self && typeof scope.self.onSubmitClick === "function") {

            const fakeEvent = {
                originalEvent: {
                    detail: 1, 
                    isTrusted: true,
                    bubbles: true
                }
            };

            scope.self.onSubmitClick(fakeEvent);
            scope.$apply(); 
        }
 

    }

    document.addEventListener('keydown', function(event) {
        if (event.key === '\\') {
            console.log('Enter key was pressed');
            answerLoop();
        } 
        if (event.key === '`'){
            englishList = [];
            targetlangList = [];
            if (document.querySelectorAll(baseLanguage) != null){
                document.querySelectorAll(baseLanguage).forEach(element => {
                    let text = element.textContent.trim()
                    englishList.push(
                        text.replace(/\([^)]*\)/g, "").trim()
                        .split(';')[0].trim()
                    ); 
                });
            }
            
            if (document.querySelectorAll(targetLanguage) != null){
                document.querySelectorAll(targetLanguage).forEach(element => {
                    let text = element.textContent.trim()
                    targetlangList.push(
                        text.replace(/\([^)]*\)/g, "").trim()
                        .split(';')[0].trim()
                    );
                });
            }


            console.log(englishList);
            console.log(targetlangList);

            if (englishList.length == 0 || targetlangList.length == 0){
                alert("List Load Failed...");
            }
            else{
                alert("List successfully loaded");
            }
        }
    }, { once: false });
})();
