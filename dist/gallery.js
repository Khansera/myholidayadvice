let slideIndex=1;function openLightbox(){document.getElementById("Lightbox").style.display="flex"}function closeLightbox(){document.getElementById("Lightbox").style.display="none"}function changeSlide(e){showSlide(slideIndex+=e)}function toSlide(e){showSlide(slideIndex=e)}function showSlide(e){let l=document.getElementsByClassName("slide"),n=document.getElementsByClassName("modal-preview");e>l.length&&(slideIndex=1),e<1&&(slideIndex=l.length);for(let s=0;s<l.length;s++)l[s].style.display="none";for(let t=0;t<n.length;t++)n[t].className=n[t].className.replace(" active","");l[slideIndex-1].style.display="block"}showSlide(slideIndex);