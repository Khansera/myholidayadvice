function displaySelectedImage(e,t){let r=document.getElementById(t),o=e.target;if(o.files&&o.files[0]){let i=new FileReader;i.onload=function(e){r.src=e.target.result},i.readAsDataURL(o.files[0])}}const imageUploadForm=document.getElementById("image-upload");imageUploadForm.addEventListener("submit",e=>{e.preventDefault(),loader(!0);let t=document.getElementById("picture"),r=new FormData(imageUploadForm);for(let[o,i]of r.entries())r.set(o,DOMPurify.sanitize(i));r.append("picture",t.files[0]),fetch("/admin/upload-image",{method:"POST",body:r}).then(e=>e.json()).then(e=>{e.success?(loader(!1),Swal.fire({title:"Success",text:"Blog Uploaded Successfully",icon:"success",confirmButtonColor:"#f87c00"})):(loader(!1),Swal.fire({title:"Error",text:e.message,icon:"error",confirmButtonColor:"#f87c00"}))}).catch(e=>{loader(!1),console.error(e),Swal.fire({title:"Error",text:"Internal Server Error",icon:"error",confirmButtonColor:"#f87c00"})})});