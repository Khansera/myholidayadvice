function displaySelectedImage(e,t){let l=document.getElementById(t),o=e.target;if(o.files&&o.files[0]){let n=new FileReader;n.onload=function(e){l.src=e.target.result},n.readAsDataURL(o.files[0])}}const blog_upload_form=document.getElementById("blog-upload");function wrapText(){let e=document.getElementById("Description"),t=window.getSelection().toString().trim(),l=document.getElementById("tagSelect").value,o=`<${l} class="highlighted-text">${t}</${l}>`,n=e.selectionStart,r=e.selectionEnd,i=e.value.substring(0,n),s=e.value.substring(r,e.value.length);e.value=i+o+s,document.getElementById("popupMenu").style.display="none"}blog_upload_form.addEventListener("submit",e=>{e.preventDefault();let t=document.getElementById("picture"),l=new FormData(blog_upload_form);for(let[o,n]of l.entries())l.set(o,DOMPurify.sanitize(n));l.append("picture",t.files[0]),fetch("/admin/upload-blog",{method:"POST",body:l}).then(e=>e.json()).then(e=>{e.success?Swal.fire({title:"Success",text:"Blog Uploaded Successfully",icon:"success",confirmButtonColor:"#f87c00"}):Swal.fire({title:"Error",text:e.message,icon:"error",confirmButtonColor:"#f87c00"})}).catch(e=>{console.error(e),Swal.fire({title:"Error",text:"Internel Server Error",icon:"error",confirmButtonColor:"#f87c00"})})}),document.addEventListener("mouseup",function(e){let t=window.getSelection().toString().trim(),l=document.getElementById("popupMenu");""!==t?(l.style.display="block",l.style.top=`${e.clientY}px`,l.style.left=`${e.clientX}px`):l.style.display="none"});