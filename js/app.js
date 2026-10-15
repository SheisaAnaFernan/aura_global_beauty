const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = value => `S/ ${Number(value).toFixed(2)}`;

const products = [
  {id:1,name:"Shampoo Reparador Nutritivo",brand:"L'Oréal Professionnel",category:"Cabello",detail:"300 ml",price:89,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",rating:"4.8"},
  {id:2,name:"Crema Facial Hidratante",brand:"Neutrogena",category:"Skincare",detail:"50 g",price:75,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",rating:"4.7"},
  {id:3,name:"Labial Mate de Larga Duración",brand:"Maybelline",category:"Maquillaje",detail:"4.2 g",price:49,image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",rating:"4.6"},
  {id:4,name:"Mascarilla Reparación Intensa",brand:"L'Oréal Professionnel",category:"Cabello",detail:"250 ml",price:109,image:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",rating:"4.7"},
  {id:5,name:"Sérum Hidratante",brand:"Neutrogena",category:"Skincare",detail:"30 ml",price:95,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",rating:"4.7"},
  {id:6,name:"Máscara de Pestañas",brand:"Maybelline",category:"Maquillaje",detail:"9.5 ml",price:59,image:"https://images.unsplash.com/photo-1631214540242-7e6f2a3b7e8f?auto=format&fit=crop&w=700&q=80",rating:"4.7"}
];
let cart = [];
let activeCategory = "Todos";
let authMode = "login";

function productCard(product, compact=false) {
  return `<article class="product-card">
    <img src="${product.image}" alt="${product.name}" loading="lazy">
    <p class="product-brand">${product.brand}</p><h3>${product.name}</h3>
    <p class="product-meta">${product.detail} · ${product.category} · ★ ${product.rating}</p>
    <div class="product-bottom"><span class="product-price">${money(product.price)}</span><button class="button button-primary" data-add-cart="${product.id}">Añadir al carrito</button></div>
  </article>`;
}
function renderProducts() {
  const query = ($("#productSearch")?.value || "").toLowerCase();
  let filtered = products.filter(p => (activeCategory==="Todos" || p.category===activeCategory) && `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query));
  const sort = $("#sortProducts")?.value;
  if(sort==="low") filtered.sort((a,b)=>a.price-b.price);
  if(sort==="high") filtered.sort((a,b)=>b.price-a.price);
  $("#productGrid").innerHTML = filtered.map(p=>productCard(p)).join("");
  $("#productResults").textContent = `${filtered.length} productos · Cabello, skincare y maquillaje`;
  $("#homeProductGrid").innerHTML = products.slice(0,3).map(p=>productCard(p,true)).join("");
}
function addToCart(id) {
  const found=cart.find(item=>item.id===id);
  if(found) found.qty++; else cart.push({id,qty:1});
  renderCart(); showToast("Producto añadido al carrito.");
}
function renderCart() {
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  $("#cartCount").textContent=count; $("#cartPill").textContent=`${count} productos`;
  const items=$("#cartItems");
  if(!cart.length) items.innerHTML='<p>Tu carrito está vacío. Explora la tienda para añadir tus favoritos.</p>';
  else items.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<article class="cart-item"><img src="${p.image}" alt="${p.name}"><div><p>${p.brand}</p><h3>${p.name}</h3><p>${p.detail} · ${p.category}</p><div class="quantity-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Reducir cantidad">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Aumentar cantidad">+</button></div></div><div><button class="remove-item" data-remove="${p.id}" aria-label="Eliminar ${p.name}">×</button><p class="item-price">${money(p.price*item.qty)}</p></div></article>`}).join("");
  const subtotal=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  const shipping=count?12:0;
  $("#cartSubtotal").textContent=money(subtotal);$("#shippingCost").textContent=money(shipping);$("#cartTotal").textContent=money(subtotal+shipping);
  $("#checkoutSummary").textContent=count?`${count} producto(s) · Total ${money(subtotal+shipping)}. Revisa tus datos antes de confirmar.`:"Añade productos para preparar tu pedido.";
}
function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2400)}

const services=[
  {name:"Cabello",desc:"Cortes, peinados y coloración",price:50,img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"},
  {name:"Uñas",desc:"Manicura y pedicura",price:35,img:"https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=600&q=80"},
  {name:"Maquillaje",desc:"Social, novia y asesoría",price:70,img:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80"},
  {name:"Estética facial",desc:"Limpieza e hidratación",price:90,img:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"},
  {name:"Estética corporal",desc:"Masajes y bienestar",price:100,img:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"}
];
$("#serviceGrid").innerHTML=services.map(s=>`<article class="service-card"><img src="${s.img}" alt="${s.name}" loading="lazy"><h3>${s.name}</h3><p>${s.desc}</p><p>45–90 min · A domicilio</p><strong class="price">Desde ${money(s.price)}</strong><button class="button button-outline" data-service-book="${s.name}">Ver profesionales</button></article>`).join("");

const pros=[
 {name:"María González",role:"Estilista Profesional",type:"Estilista",price:50,rating:"5.0",reviews:120,years:8,img:"https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=500&q=80",services:["Corte y styling","Coloración completa","Peinado para ocasión"],bio:"Creo en una belleza que se siente natural. Te ayudo a encontrar el corte y el estilo que mejor expresan quién eres."},
 {name:"Valentina Pérez",role:"Maquilladora Profesional",type:"Maquillaje",price:70,rating:"5.0",reviews:98,years:6,img:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",services:["Maquillaje social","Maquillaje de novia","Asesoría"],bio:"Maquillaje personalizado para resaltar tus facciones y acompañarte en tus ocasiones especiales."},
 {name:"Shirley Fernández",role:"Manicurista Profesional",type:"Manicurista",price:35,rating:"4.9",reviews:86,years:5,img:"https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=500&q=80",services:["Manicura semipermanente","Uñas acrílicas o gel"],bio:"Cuidado detallista de manos y uñas, con higiene y acabados prolijos."},
 {name:"Victoria Núñez",role:"Esteticista Profesional",type:"Estética",price:90,rating:"5.0",reviews:89,years:7,img:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=80",services:["Tratamiento antiedad","Masajes relajantes"],bio:"Tratamientos de bienestar personalizados para cuidar tu piel y relajarte."}
];
let selectedPro=pros[0];
function renderProfessionals(){
 const q=($("#professionalQuery")?.value||"").toLowerCase(), type=$("#professionalFilter")?.value||"Todas";
 const filtered=pros.filter(p=>(type==="Todas"||p.type===type)&&`${p.name} ${p.role} ${p.services.join(" ")}`.toLowerCase().includes(q));
 $("#professionalList").innerHTML=filtered.map(p=>`<article class="professional-card"><img src="${p.img}" alt="${p.name}" loading="lazy"><div><h3>${p.name}</h3><p>${p.role}</p><p class="rating">★ ${p.rating} <small>(${p.reviews} reseñas)</small></p><p>Desde ${money(p.price)}</p><button class="button button-outline" data-view-pro="${p.name}">Ver perfil</button></div></article>`).join("")||"<p>No encontramos profesionales con esos filtros.</p>";
 if(!filtered.includes(selectedPro)) selectedPro=filtered[0]||pros[0];
 renderProfessionalDetail();
}
function renderProfessionalDetail(){
 const p=selectedPro;
 $("#professionalDetail").innerHTML=`<div class="detail-header"><img src="${p.img}" alt="${p.name}"><div><span class="pill">Perfil del profesional</span><h2>${p.name}</h2><p>${p.role}</p><p>★ ${p.rating} · ${p.reviews} reseñas · ${p.years} años de experiencia</p><p>${p.type} · Atención a domicilio</p></div></div><p>“${p.bio}”</p><hr><h2>Servicios y precios</h2>${p.services.map((s,i)=>`<div class="price-row"><span>${s}</span><span>${i===0?"60":i===1?"90":"60"} min</span><strong>${money(p.price+(i===1?100:i===2?30:0))}</strong></div>`).join("")}<h2>Ubicación</h2><p>Miraflores, Lima · Atención a domicilio en Miraflores, San Isidro y Barranco.</p><hr><h2>Reseñas</h2><p><strong>Lucía R. · ★★★★★</strong><br>“Entendió exactamente lo que quería. Muy profesional.”</p><p><strong>Andrea M. · ★★★★★</strong><br>“Puntual, muy cuidadosa y profesional. La recomiendo.”</p><button class="button button-primary" data-book-pro="${p.name}">Reservar con ${p.name.split(" ")[0]} →</button>`;
}
function openBooking(proName){
 if(proName){const p=pros.find(x=>x.name===proName);if(p){selectedPro=p;$("#bookingProfessional").value=p.name;}}
 updateBookingSummary();const date=$("#bookingDate");if(!date.value){const d=new Date();d.setDate(d.getDate()+1);date.value=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;date.min=date.value;}
 $("#bookingMessage").textContent="";$("#bookingModal").showModal();
}
function updateBookingSummary(){
 const [name,price,duration]=$("#bookingService").value.split("|");
 $("#bookingSummaryService").textContent=name;$("#bookingSummaryDetails").textContent=`${$("#bookingProfessional").value} · ${duration} minutos · ${$("#bookingDate").value||"Fecha por elegir"} · ${$("#bookingTime").value}`;
 $("#bookingPrice").textContent=money(price);
}
function showSection(hash){
 const id=(hash||"#inicio").replace("#","");
 const target=document.getElementById(id)||$("#inicio");
 $$(".page-section").forEach(section=>section.classList.toggle("active",section===target));
 $$(".main-nav a").forEach(a=>a.classList.toggle("current",a.getAttribute("href")===`#${target.id}`));
 $("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");
 if(target.id==="carrito")renderCart();
 window.scrollTo({top:0,behavior:"smooth"});
}

const slides=[
 {image:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",alt:"Estilista atendiendo a una clienta",eyebrow:"CUIDADO PROFESIONAL",title:"Tu belleza, a tu manera"},
 {image:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=85",alt:"Maquillaje profesional",eyebrow:"RESALTA TU ESENCIA",title:"Lista para cada ocasión"},
 {image:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",alt:"Tratamiento de cuidado facial",eyebrow:"BIENESTAR EN CASA",title:"Un momento solo para ti"}
];
let slideIndex=0;
function renderSlide(){const s=slides[slideIndex];$("#heroImage").src=s.image;$("#heroImage").alt=s.alt;$("#slideEyebrow").textContent=s.eyebrow;$("#slideTitle").textContent=s.title;$("#sliderDots").innerHTML=slides.map((_,i)=>`<button aria-label="Mostrar imagen ${i+1}" class="${i===slideIndex?"active":""}" data-slide="${i}"></button>`).join("")}
function changeSlide(delta){slideIndex=(slideIndex+delta+slides.length)%slides.length;renderSlide()}

$("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open))});
document.addEventListener("click",e=>{
 const navLink=e.target.closest('a[href^="#"]');
 if(navLink && navLink.getAttribute("href").length>1){const hash=navLink.getAttribute("href");if(document.querySelector(hash)?.classList.contains("page-section")){e.preventDefault();history.replaceState(null,"",hash);showSection(hash)}}
 const add=e.target.closest("[data-add-cart]");if(add)addToCart(Number(add.dataset.addCart));
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x!==item);renderCart()}}
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));renderCart();showToast("Producto eliminado.")}
 const filter=e.target.closest("[data-filter]");if(filter){activeCategory=filter.dataset.filter;$$("[data-filter]").forEach(b=>b.classList.toggle("active",b===filter));renderProducts()}
 const view=e.target.closest("[data-view-pro]");if(view){selectedPro=pros.find(p=>p.name===view.dataset.viewPro)||pros[0];renderProfessionalDetail()}
 const book=e.target.closest("[data-open-booking]");if(book)openBooking();
 const serviceBook=e.target.closest("[data-service-book]");if(serviceBook){const s=serviceBook.dataset.serviceBook;const match={"Cabello":"Corte y styling|50|60","Uñas":"Manicura y pedicura|35|45","Maquillaje":"Maquillaje social|70|60","Estética facial":"Limpieza facial|90|60","Estética corporal":"Masaje de bienestar|100|60"}[s];if(match)$("#bookingService").value=match;openBooking()}
 const bookPro=e.target.closest("[data-book-pro]");if(bookPro)openBooking(bookPro.dataset.bookPro);
 const slide=e.target.closest("[data-slide]");if(slide){slideIndex=Number(slide.dataset.slide);renderSlide()}
 const tab=e.target.closest("[data-auth-tab]");if(tab){authMode=tab.dataset.authTab;updateAuthMode()}
});
window.addEventListener("hashchange",()=>showSection(location.hash));
$("#prevSlide").addEventListener("click",()=>changeSlide(-1));$("#nextSlide").addEventListener("click",()=>changeSlide(1));
$("#productSearch").addEventListener("input",renderProducts);$("#sortProducts").addEventListener("change",renderProducts);
$("#serviceSearch").addEventListener("submit",e=>{e.preventDefault();location.hash="#profesionales";$("#professionalQuery").value=$("#serviceQuery").value;renderProfessionals();showSection("#profesionales")});
$("#professionalSearch").addEventListener("submit",e=>{e.preventDefault();renderProfessionals()});
$("#professionalQuery").addEventListener("input",renderProfessionals);$("#professionalFilter").addEventListener("change",renderProfessionals);
$("#bookingService").addEventListener("change",updateBookingSummary);$("#bookingProfessional").addEventListener("change",updateBookingSummary);$("#bookingDate").addEventListener("change",updateBookingSummary);$("#bookingTime").addEventListener("change",updateBookingSummary);
$("#bookingForm").addEventListener("submit",e=>{e.preventDefault();const service=$("#bookingService").value.split("|")[0];$("#bookingMessage").textContent=`¡Reserva de demostración confirmada! ${service}, ${$("#bookingDate").value} a las ${$("#bookingTime").value}.`;showToast("Reserva de demostración confirmada.");});
$("#checkoutButton").addEventListener("click",()=>{if(!cart.length){$("#checkoutMessage").textContent="Tu carrito está vacío.";return}if(!$("#acceptTerms").checked){$("#checkoutMessage").textContent="Acepta los términos para continuar.";return}$("#checkoutMessage").textContent="Pedido de demostración registrado. No se ha realizado ningún cobro.";showToast("Pedido de demostración registrado.")});
$("#trackingButton").addEventListener("click",()=>$("#trackingMessage").textContent="Tu pedido está en camino. Código: AURA-LIM-1048.");
$("#returnButton").addEventListener("click",()=>$("#returnMessage").textContent="Solicitud de demostración creada. Nuestro equipo revisaría la elegibilidad del producto.");
$("#profileForm").addEventListener("submit",e=>{e.preventDefault();$("#greetingName").textContent=$("#accountName").value.trim()||"Cliente";$("#profileMessage").textContent="Cambios guardados en esta demostración.";});
$("#addAddress").addEventListener("click",()=>{const address=prompt("Escribe tu nueva dirección:");if(address){$("#extraAddress").innerHTML=`<p class="address-box"><strong>Dirección adicional</strong><br>${address}</p>`;showToast("Dirección añadida en esta demostración.")}});
$("#changePassword").addEventListener("click",()=>$("#settingsMessage").textContent="Para una aplicación real, aquí se abriría el flujo seguro de cambio de contraseña.");
$("#logoutButton").addEventListener("click",()=>{$("#sessionStatus").textContent="Has cerrado la sesión de demostración.";showToast("Sesión de demostración cerrada.")});
$("#showRegister").addEventListener("click",()=>{$("#authModal").showModal()});
function updateAuthMode(){const registering=authMode==="register";$("#authTitle").textContent=registering?"Crea tu cuenta Aura":"Bienvenida a Aura";$("#authName").parentElement.hidden=!registering;$("#confirmPasswordWrap").hidden=!registering;$("#confirmPassword").required=registering;$("#authSubmit").textContent=registering?"Crear cuenta":"Iniciar sesión";$$("[data-auth-tab]").forEach(b=>b.classList.toggle("active",b.dataset.authTab===authMode));$("#authMessage").textContent=""}
$("#authForm").addEventListener("submit",e=>{e.preventDefault();if(authMode==="register"&&$("#authPassword").value!==$("#confirmPassword").value){$("#authMessage").textContent="Las contraseñas no coinciden.";return}if(authMode==="register"&&$("#authName").value.trim())$("#greetingName").textContent=$("#authName").value.trim().split(" ")[0];$("#sessionStatus").textContent=`Sesión de demostración: ${$("#authEmail").value}`;$("#authMessage").textContent=authMode==="register"?"Cuenta de demostración creada correctamente.":"Sesión de demostración iniciada.";showToast(authMode==="register"?"Cuenta de demostración creada.":"Sesión iniciada.");});
renderProducts();renderCart();renderProfessionals();renderSlide();updateAuthMode();showSection(location.hash||"#inicio");
setInterval(()=>changeSlide(1),7000);
