
let globalItems=[];
const client = contentful.createClient({
    space: "2812lkm198dq",
    accessToken: "Wo8_P8BLK0M_Mm65vuj0mHK1I2Wtsf0WAqr7_iIspn0"
  });

const header_icon=document.querySelector('.inner i');
const sidebar=document.querySelector('.sidebar');
const overall=document.querySelector('.over_all');
const count=document.querySelector('.cart_count');
const products=document.querySelector('.products');
const total=document.querySelector('.total h2');
const clearBtn=document.querySelector('.clear');
const last=document.querySelector('.last');
header_icon.addEventListener('click',()=>{
    sidebar.classList.toggle('origin');
});

clearBtn.addEventListener('click',clearData);
let cartItems=[];
async function getProducts(){
    let dat=await client.getEntries({
        content_type: "houseProducts"
    });
    const products=dat.items;
    globalItems=products.map(item=>{
        const {title:name,price}=item.fields;
        const img=item.fields.image.fields.file.url;
        return {name,price,img};
    });
}

document.addEventListener('DOMContentLoaded',()=>{
    var fir=JSON.parse(localStorage.getItem('cartProducts'));
    if(fir)
    count.innerHTML=fir.length;
    getProducts().then(e=> {addProducts()});
});

 function addProducts(){

    globalItems.forEach(item => {
        var div=document.createElement('div');
        div.classList.add('product');
        div.innerHTML=`
        <img src=${item.img} alt="">
        <div class="bag_info">
            <span class="bag_icon">
                <i class="fas fa-shopping-cart"></i>
            </span>
            <p class="cart_info">Add to cart</p>
        </div>
        <div class="price_info">
            <p class="product_name">${item.name}</p>
            <p class="price">${item.price} 
            $</p>
        </div>
        `
        products.appendChild(div);
    });
    showCart();
    addlisteners();
}

function addlisteners(){
    const bag_cart=document.querySelectorAll('.bag_info');
    let temp=localStorage.getItem('cartProducts'); 
    temp=JSON.parse(temp);
    bag_cart.forEach((one,index) => {
        var dead=one.previousElementSibling.getAttribute('src');       
        one.addEventListener('click',()=>{
            last.classList.add('add');
            setTimeout(remstatus,500);
            const img=one.previousElementSibling.getAttribute('src');
            const name=one.nextElementSibling.firstElementChild.innerHTML;
            const price=one.nextElementSibling.lastElementChild.innerHTML;
            cartItems.push({id:index,image:img,Name:name,Price:price,plural:1});
            updateStatus(one);
            updateCartContent();
            showCart();
        });
        if(temp.some (pro => pro.image === dead))
        updateStatus(one);
    });
}

function remstatus(){
   last.classList.remove('add');
}

function updateCartContent(){
    localStorage.setItem('cartProducts',JSON.stringify(cartItems));
}

function updateStatus(e){
    e.innerHTML=`<i class="fas fa-shopping-basket" style="margin-right:.5rem"></i>In Basket`;
    e.classList.add('demo');
    count.innerHTML=cartItems.length;
}

function showCart(){
    var content="";
    var sum=0;
    let temp=localStorage.getItem('cartProducts');
    if(temp==null)
    return;
    cartItems=JSON.parse(temp);
    cartItems.forEach(ele => {
        content+=`
        <div class="cart_content">
            <div class="pro_img">
                <img src=${ele.image} alt="">
            </div>
            <div class="detail">
                <h4>${ele.Name}</h4>
                <h4>${ele.Price}</h4>
                <i class="fas fa-trash"></i>
            </div>
            <div class="increase">
                <i class="fas fa-chevron-up"></i>
                <p style="color: rgb(43, 37, 27);">${ele.plural}</p>
                <i class="fas fa-chevron-down" ></i>
            </div>
        </div>
        `
        sum+=(parseFloat(ele.Price)*ele.plural);
        sum=parseFloat(sum.toFixed(2));
    });
    total.innerHTML=`your total : ${sum} $`;
    overall.innerHTML=content;
    const trash=document.querySelectorAll('.detail i');
    trash.forEach((ele,index)=> {
        ele.addEventListener('click',()=>{
            removeItem(index);
        });
    });

    const inc=document.querySelectorAll('.increase i');
    inc.forEach((ele,index)=> {
        ele.addEventListener('click',()=>{
            IncDec(event,index);
        });
    });
    count.innerHTML=cartItems.length;
}

function IncDec(e,index){
    
    if(e.target.classList[1]==="fa-chevron-up"){
        const p=e.target.nextElementSibling;
        p.innerHTML=Number(p.innerHTML)+1;
        cartItems[index-Math.floor(index/2)].plural=p.innerHTML;
    }
    else{
        const p=e.target.previousElementSibling;
        p.innerHTML=Number(p.innerHTML)-1;
        cartItems[index-1-Math.floor(index/2)].plural=p.innerHTML;
        if(p.innerHTML==0)
        removeItem(index-1-Math.floor(index/2));
    }
    localStorage.setItem('cartProducts',JSON.stringify(cartItems));
    showCart();
    
}

function removeItem(index){
    const removeImg=cartItems[index].image;
    cartItems.splice(index,1);
    localStorage.setItem('cartProducts',JSON.stringify(cartItems));
    showCart();
    count.innerHTML=cartItems.length;
    var bag=document.querySelectorAll('.product');
    bag.forEach(ele => {
       if(ele.children[0].getAttribute('src')===removeImg){
           ele.children[1].innerHTML=`
            <span class="bag_icon">
            <i class="fas fa-shopping-cart"></i>
            </span>
            <p class="cart_info">Add to cart</p>
             `
            ele.children[1].classList.remove('demo');
       }
        
    });
        
}

function clearData(){
    if(cartItems.length==0)
    return;
    cartItems.splice(0,cartItems.length);
    localStorage.setItem('cartProducts',JSON.stringify(cartItems));
    showCart();
    const tempo=document.querySelectorAll('.bag_info');
    tempo.forEach(ele => {
        ele.innerHTML=`
        <span class="bag_icon">
            <i class="fas fa-shopping-cart"></i>
        </span>
        <p class="cart_info">Add to cart</p>
        `
        ele.classList.remove('demo');
    });
    
}
