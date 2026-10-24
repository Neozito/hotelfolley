'use strict';
const menuButton=document.querySelector('.menu-button');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');}
menuButton?.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
window.addEventListener('resize',()=>{if(window.innerWidth>900)closeMenu();});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const photos=[...document.querySelectorAll('[data-photo]')];
const lightbox=document.querySelector('#lightbox');let photoIndex=0;let focusedPhoto;
function visiblePhotos(){return photos.filter(p=>!p.hidden);}
function showPhoto(index){const ps=visiblePhotos();photoIndex=(index+ps.length)%ps.length;const photo=ps[photoIndex];lightbox.querySelector('figure img').src=photo.dataset.photo;lightbox.querySelector('figure img').alt=photo.dataset.caption;lightbox.querySelector('figcaption').textContent=`${photo.dataset.caption} · ${photoIndex+1} / ${ps.length}`;}
photos.forEach(photo=>photo.addEventListener('click',()=>{focusedPhoto=photo;showPhoto(visiblePhotos().indexOf(photo));lightbox.showModal();document.body.style.overflow='hidden';}));
lightbox.querySelector('.lightbox-close')?.addEventListener('click',()=>lightbox.close());
lightbox.querySelector('.lightbox-prev')?.addEventListener('click',()=>showPhoto(photoIndex-1));
lightbox.querySelector('.lightbox-next')?.addEventListener('click',()=>showPhoto(photoIndex+1));
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showPhoto(photoIndex+1);if(e.key==='ArrowLeft')showPhoto(photoIndex-1);});
lightbox.addEventListener('close',()=>{document.body.style.overflow='';focusedPhoto?.focus();});
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
function updateCount(){const counter=document.querySelector('.gallery-count');if(counter)counter.textContent=`${visiblePhotos().length} fotos para conhecer o seu próximo destino.`;}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});photos.forEach(photo=>photo.hidden=button.dataset.filter!=='all'&&photo.dataset.category!==button.dataset.filter);updateCount();}));updateCount();
const form=document.querySelector('#reservation-form');
if(form){
 const arrival=form.elements.chegada,departure=form.elements.saida;
 const now=new Date();const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;arrival.min=today;
 function nextDay(iso){const d=new Date(iso+'T12:00:00');d.setDate(d.getDate()+1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 departure.min=nextDay(today);
 arrival.addEventListener('change',()=>{departure.min=arrival.value?nextDay(arrival.value):nextDay(today);if(departure.value&&departure.value<departure.min)departure.value='';});
 const selected=new URLSearchParams(location.search).get('quarto');if(selected&&[...form.elements.quarto.options].some(o=>o.value===selected))form.elements.quarto.value=selected;
 form.addEventListener('submit',event=>{
  event.preventDefault();const error=document.querySelector('#form-error');error.textContent='';
  const data=new FormData(form);const name=String(data.get('nome')).trim();const phone=String(data.get('telefone')).replace(/\D/g,'');
  if(!name){error.textContent='Informe seu nome para continuar.';form.elements.nome.focus();return;}
  if(phone.length<10||phone.length>13){error.textContent='Informe um telefone válido com DDD.';form.elements.telefone.focus();return;}
  if(arrival.value<today||departure.value<=arrival.value){error.textContent='Confira as datas: a saída deve ser depois da chegada.';return;}
  const date=s=>s.split('-').reverse().join('/');
  const lines=['Olá, equipe do Hotel Folley! Gostaria de consultar disponibilidade.','',`Nome: ${name}`,`Telefone: ${data.get('telefone')}`,data.get('email')?`E-mail: ${data.get('email')}`:'',`Chegada: ${date(data.get('chegada'))}`,`Saída: ${date(data.get('saida'))}`,`Acomodação: ${data.get('quarto')}`,`Adultos: ${data.get('adultos')}`,`Crianças: ${data.get('criancas')}`,`Quartos: ${data.get('quartos')}`,data.get('mensagem')?`Mensagem: ${data.get('mensagem')}`:'','Aguardo as tarifas e a confirmação de disponibilidade.'];
  const url='https://wa.me/5545999496152?text='+encodeURIComponent(lines.filter(Boolean).join('\n'));window.location.href=url;
 });
}
