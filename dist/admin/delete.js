function Delete(e, t) { let o = confirm("Do you want to delete this?"); if (o) { let d = e.getAttribute("data-id"), a = new FormData; a.append("collectionName", t), fetch(`/admin/delete/${d}`, { method: "DELETE", body: a }).then(t => { if (t.error) alert("Error Occured"); else { let o = e.parentNode, d = o.parentNode, a = d.parentNode; a.classList.add("fade-out"), setTimeout(() => { a.remove(), alert("item removed") }, 500) } }).catch(e => { console.log(e) }) } } window.addEventListener("popstate", function (e) { location.reload() });