var input = document.querySelector("input[name=Destinations]");

function displaySelectedImage(e, t) {
    let n = document.getElementById(t),
        r = e.target;
    if (r.files && r.files[0]) {
        let i = new FileReader;
        i.onload = function(e) {
            n.src = e.target.result
        }, i.readAsDataURL(r.files[0])
    }
}

function insertInput(e) {
    let t = document.createElement("input");
    t.type = "text", t.placeholder = "Point", t.classList.add("form-control", "mt-3");
    let n = e.closest(".important-points-container");
    if (n) {
        let r = n.lastElementChild;
        n.insertBefore(t, r)
    } else console.error("Container not found.")
}

function removePoints(e) {
    let t, n = document.querySelectorAll(e);
    n.forEach(e => {
        e.addEventListener("click", () => {
            (t = e.parentNode.parentNode).classList.add("fade-out"), setTimeout(() => {
                t.remove()
            }, 500)
        })
    })
}

function createPoints(e, t, n, r, i, o) {
    let l = document.querySelectorAll(`.${r}`);
    if (l.length >= i) {
        alert("Maximum limit reached. Cannot add more elements.");
        return
    }
    let a = Math.min(e, i - l.length);
    for (let s = 0; s < a; s++) {
        let c = document.createElement(t);
        c.classList.add("mb-3", r), c.classList.add("position-relative"), "itenary-container" === r ? c.innerHTML = `
    <p class="text-end my-2">
        <i class="ri-delete-bin-5-fill fs-3 btn-del text-primary" ></i>
    </p>
    <input type="text" class="form-control mb-3 bg-light" id="input-${o}-${s}" placeholder="Heading">
    <textarea  class="form-control" id="text-${o}-${s}" placeholder="Description"></textarea>
` : c.innerHTML = `
    <p class="text-end my-2">
        <i class="ri-delete-bin-5-fill fs-3 btn-del text-primary" ></i>
    </p>
    
    <input type="text" class="form-control mb-3 bg-light" id="input-${o}-${s}" placeholder="Heading">
    <input  class="form-control" id="text-${o}-${s}" placeholder="Point"></input>
    <div class="text-center"><button type="button" onclick=insertInput(this) class="text-center mt-3 btn btn-primary" ><i class="ri-add-box-fill fs-3"></i></button></div>
`, n.append(c)
    }
    window.scrollBy(0, 50)
}
new Tagify(input);
const generate_btn = document.getElementById("generate-inputs"),
    generate_input = document.getElementById("iternaryPoints"),
    itenary = document.getElementById("itenary");
generate_btn.addEventListener("click", () => {
    createPoints(Number(generate_input.value), "div", itenary, "itenary-container", 20, "itenary"), removePoints(".btn-del")
});
const important_points = document.getElementById("important-points"),
    generate_btn_2 = document.getElementById("generate-inputs-2"),
    input_important_points = document.getElementById("importantPoints");

function processString(e) {
    return e = e.replace(/\/n/g, "<br>").replace(/\/hr/g, "<hr>")
}

function creatArray(e) {
    let t = document.querySelectorAll(e),
        n = Array.from(t).map(t => {
            let n = processString(t.querySelector("input").value);
            if (".important-points-container" !== e) {
                let r = processString(t.querySelector("textarea").value);
                return {
                    heading: n,
                    description: r
                }
            } {
                let i = [],
                    o = t.querySelectorAll("input");
                for (let l = 1; l < o.length; l++) i.push(o[l].value);
                return {
                    heading: n,
                    notes: i
                }
            }
        });
    return n
}
generate_btn_2.addEventListener("click", () => {
    createPoints(Number(input_important_points.value), "div", important_points, "important-points-container", 4, "important"), removePoints(".btn-del")
});
const package_upload_form = document.getElementById("package-upload");

function wrapText(e) {
    let t = window.getSelection().toString().trim(),
        n = document.getElementById("tagSelect").value,
        r = `<${n} class="highlighted-text">${t}</${n}>`,
        i = e.selectionStart,
        o = e.selectionEnd,
        l = e.value.substring(0, i),
        a = e.value.substring(o, e.value.length);
    e.value = l + r + a, document.getElementById("popupMenu").style.display = "none"
}
package_upload_form.addEventListener("submit", e => {
    e.preventDefault();
    let t = document.getElementById("picture"),
        n = JSON.stringify(creatArray(".itenary-container")),
        r = JSON.stringify(creatArray(".important-points-container")),
        i = new FormData(package_upload_form);
    for (let [o, l] of (i.append("tourInfo", n), i.append("importantInfo", r), i.entries())) i.set(o, DOMPurify.sanitize(l));
    i.append("picture", t.files[0]), fetch("/admin/upload-package", {
        method: "POST",
        body: i
    }).then(e => e.json()).then(e => {
        e.success ? Swal.fire({
            title: "Success",
            text: "Package Uploaded Successfully",
            icon: "success",
            confirmButtonColor: "#f87c00"
        }) : Swal.fire({
            title: "Error",
            text: e.message,
            icon: "error",
            confirmButtonColor: "#f87c00"
        })
    }).catch(e => {
        console.error(e), Swal.fire({
            title: "Error",
            text: "Internel Server Error",
            icon: "error",
            confirmButtonColor: "#f87c00"
        })
    })
}), document.addEventListener("mouseup", function(e) {
    let t = window.getSelection().toString().trim();
    if ("" !== t) {
        if (!document.getElementById("popupMenu")) {
            let n = document.createElement("div");
            n.id = "popupMenu", n.innerHTML = `
                <select id="tagSelect">
                    <option value="strong">highlight</option>
                    <option value="li">Bullet</option>
                    <!-- Add more options as needed -->
                </select>
                <button id="wrap">Wrap Text</button>
            `, n.style.position = "absolute", n.style.top = "0", n.style.left = "0", console.log("appending");
            let r = e.target.parentNode;
            r.insertBefore(n, e.target);
            let i = n.querySelector("#wrap");
            i.addEventListener("click", () => {
                wrapText(e.target), r.removeChild(n)
            })
        }
    } else {
        let o = document.getElementById("popupMenu");
        o && o.remove()
    }
});
const linkform=document.getElementById('links-upload');
linkform.addEventListener('submit',async (e)=>{
    e.preventDefault()
    const form_data=new FormData(linkform)

    const send_data=await fetch('/admin/upload-link',{
        method:'POST',
        body:form_data
    })
    const raw=await send_data.json()
    const response=raw.error;
   if(!response){
    alert('send successfull :-', response.message)
   }else{
    alert('Error sending data')
   }

})