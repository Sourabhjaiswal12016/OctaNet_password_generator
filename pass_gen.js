
const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()--+={[}]|\:;"<>.,/';

// starting me password khali pada hai
let password="";
let passwordLength=10;
let checkCount=0;


//function handle slider ko call bhi karna padega
handleSlider();
//set strength circle color to grey:later
setIndicator("#ccc");

//set password length:
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
    
}

//set-indicator ke do kam hai: 1)color of circle 2)shadow on that circle:
function setIndicator(color){
    indicator.style.backgroundColor=color;
    // console.log("//shadow: hw");
    indicator.style.boxShadow=`0px 0px 12px 1px ${ color }`;
}
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min))+min;
   
}
function generateRandomNumber()
{
    //since ek single integer ka random number chahiye isiliye (0,9);
    return getRndInteger(0,9);
    
} 
//NOTE: "String.fromCharCode" is used to convert number into character;
function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97,123));//lower case a ki ascii =97, lower case z ki ascii =123:
    
}
function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91));//upper case A ki ascii =65, upper case Z ki ascii =91:
    
}
function generateSymbol()
{
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);//charAt is used to tell the character at that index:
   
}

function clacStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked)hasUpper=true;
    if(lowercaseCheck.checked)hasLower=true;
    if(numbersCheck.checked)hasNum=true;
    if(symbolsCheck.checked)hasSym=true;

    if(hasUpper&& hasLower&&(hasNum||hasSym) && (passwordLength>=8))
    {
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper)&& (hasNum||hasSym) && (passwordLength>=6))
    {
setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

   async function copyContent()
    {
        try{
        
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
        }
        
        catch(e){
            copyMsg.innerText="failed";
        }
        // to make copy wala visible:
        copyMsg.classList.add("active");
        // to make it invisible:
        setTimeout(()=>{ 
            copyMsg.classList.remove("active");
 
        },2000);

    }



    function shufflePasword(array){
        //fisher yates method: to shuffle:
        for(let i=array.length-1 ; i>0 ; i--)
        {
            //random j find kia:
            const j=Math.floor(Math.random()*(i+1));

            // i aur j ke index par padi values ko swap kara dia aapas me
            const temp=array[i];
            array[i]=array[j];
            array[j]=temp;
        }
        let str="";
        array.forEach((el)=>(str+=el));
        return str;
    }
    function handleCheckBoxChange()
    {
        checkCount=0;
        allCheckBox.forEach((checkbox)=>
        {
            if(checkbox.checked)
            checkCount=checkCount+1;
        })

        //special condition: if no. of checkcount < the check boxes 
        //then no. of checkCount==atleast total no. of checkBoxes
        if(passwordLength<checkCount)
        {
            passwordLength=checkCount;
            handleSlider();
        }
    }

    allCheckBox.forEach((checkbox)=>
    {
        checkbox.addEventListener('change',handleCheckBoxChange);
    })
//jab mai slider ko aage piche karu tab upar number change ho isiliye handleslider ko call kia hai:
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',()=>
{
    if(passwordDisplay.value)//if password display par ek non empty value hai to hi copy hoga:
    copyContent();
    })
    

generateBtn.addEventListener('click',()=>{
    //if none of the checkboxes is selected:
    if(checkCount<=0)
    return;
//    console.log( "special case: pass length< checkcount:");
    if(passwordLength < checkCount)
    {
        passwordLength=checkCount;
        handleSlider();

    }
    // console.log("starting the journey");
    //journey to find new password:
    //remove old pass:
    password="";
    //lets put the stuff mentioned by checkboxes:
    // if(uppercaseCheck.checked)
    // {
        // password=+generateUpperCase();

    // }

    // if(lowercaseCheck.checked)
    // {
        // password=+generateLowerCase();
    // }

    // if(numbersCheck.checked)
    // {
        // password=+ generateRandomNumber();
    // }

    // if(symbolsCheck.checked)
    // {
        // password=+generateSymbol();
    // }

    let funArr=[];
    if(uppercaseCheck.checked)
    funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
    funArr.push(generateLowerCase);

    if(numbersCheck.checked)
    funArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
    funArr.push(generateSymbol);
     
    //compulsry addition:
    for(let i=0;i<funArr.length;i++)
    {
        password+=funArr[i]();
    }

    //remaining addition:randomly;
    for(let i=0;i<passwordLength-funArr.length;i++)
    {
        let randIndex=getRndInteger(0,funArr.length);
        password+=funArr[randIndex]();

    }
    

    //shuffle the password:
    password=shufflePasword(Array.from(password));
    // console.log("shuffle done");
    //show in ui:
    passwordDisplay.value=password;
    // console.log("ui done");
    //calculate strength:
    clacStrength();
});

