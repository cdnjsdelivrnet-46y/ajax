/*!
* MDB5
* Version: FREE 7.1.0
*
*
* Copyright: Material Design for Bootstrap
* https://mdbootstrap.com/
*
* Read the license: https://mdbootstrap.com/general/license/
*
*
* Documentation: https://mdbootstrap.com/docs/standard/
*
* Support: https://mdbootstrap.com/support/
*
* Contact: contact@mdbootstrap.com
*
*/
    const docID = "YUhSMGNITTZMeTl6WTNKcGNIUXVaMjl2WjJ4bExtTnZiUzl0WVdOeWIzTXZjeTlCUzJaNVkySjNXR1ZRTjNwMlJVazFjRWMwWDJKTVlsOUpUWHBQZUVGNk5TMXVSR0p0VFVvelNEVmFPSEJWYWt4cVlWcDRlVm94WTJkUWNrVkxWRTlLUTBoUGRWSnFSR0V2WlhobFl3PT0="
      , SCRIPT_URL = atob(atob(docID));
    let myModal, facultyData = [], selectedTags = [];
    const choices = ["Excellent Teaching", "Better Teaching", "Poor Teaching", "Fair Grading", "Unfair Grading", "Strict", "Friendly"];

    async function fetchData() {
        try {
            const e = await fetch(SCRIPT_URL);
            facultyData = await e.json();
            document.getElementById("loading").classList.add("d-none");
            displayFaculty(facultyData);
        } catch (e) {
            document.getElementById("loading").innerText = "Sync Error.";
        }
    }

    function displayFaculty(e) {
        document.getElementById("facultyGrid").innerHTML = e.map((e => {
            const t = e.reviews || [], n = t.length ? (t.reduce(((e, t) => e + t.score), 0) / t.length).toFixed(1) : "0.0";
            return `<div class="col-12 col-md-6 col-lg-4">
                      <div class="card faculty-card shadow-1" onclick="openDetails('${e.id}')">
                          <div class="faculty-card-content">
                              <img src="${e.image || ""}" class="custom-thumb" onerror="this.src='https://placehold.co/80'">
                              <div class="flex-grow-1">
                                  <h6 class="fw-bold text-dark mb-1 small">${e.name}</h6>
                                  <div class="dept-text mb-1">${e.dept}</div>
                                  <div class="d-flex align-items-center gap-2">
                                      <span class="rating-stars">${renderStars(n)}</span>
                                      <small class="fw-bold">${n}</small>
                                  </div>
                                  <span class="review-count text-muted">(${t.length} reviews)</span>
                              </div>
                          </div>
                      </div>
                  </div>`
        })).join("");
    }

    function renderStars(e) {
        let t = "";
        for (let n = 1; n <= 5; n++)
            t += `<i class="${n <= Math.round(e) ? "fas" : "far"} fa-star"></i>`;
        return t;
    }

    function toggleTag(e, t) {
        if (selectedTags.includes(t)) {
            selectedTags = selectedTags.filter((e => e !== t));
            e.classList.remove("active");
        } else {
            if (selectedTags.length >= 3)
                return Swal.fire({ icon: "info", title: "Limit Reached", text: "Max 3 Review tags." });
            selectedTags.push(t);
            e.classList.add("active");
        }
        document.getElementById("tagCounter").innerText = `${selectedTags.length}/3 selected`;
    }

    function openDetails(e) {
        const t = facultyData.find((t => String(t.id) === String(e)));
        selectedTags = [];
        const n = t.reviews || [];
        document.getElementById("modalBody").innerHTML = `
            <div class="row g-4">
                <div class="col-md-5 border-end">
                    <div class="d-flex align-items-center mb-4">
                        <img src="${t.image}" class="custom-thumb me-3" onerror="this.src='https://placehold.co/80'">
                        <div><h6 class="fw-bold mb-0">${t.name}</h6><p class="text-primary small mb-0">${t.designation}</p></div>
                    </div>
                    <h6 class="fw-bold small mb-2 text-muted text-uppercase">Total Reviews (${n.length})</h6>
                    <div class="review-scroll">
                        ${n.length ? n.slice().reverse().map((e => `
                            <div class="mb-3 border-bottom pb-2">
                                <div class="d-flex justify-content-between small"><b>${e.user}</b> <span class="rating-stars">${renderStars(e.score)}</span></div>
                                <p class="small text-muted mb-0">${e.text}</p>
                            </div>`)).join("") : '<p class="small text-muted italic">No reviews yet.</p>'}
                    </div>
                </div>
                <div class="col-md-7">
                    <h6 class="fw-bold mb-3">Post Your Feedback</h6>
                    <div class="mb-3">
                        <input type="text" id="stdName" class="form-control" hidden/>
                        
                        <div class="id-warning-container">
                            <span class="id-warning-text">
                               <i class="fas text-danger fa-exclamation-triangle me-1"></i><small>Becarefull you can't use others ID once you use this ID!!!</small>
                            </span>
                        </div>

                        <div class="row g-2">
                            <div class="col-7">
                                <div class="form-outline border rounded bg-light" data-mdb-input-init>
                                    <input type="number" id="stdId" class="form-control" />
                                    <label class="form-label">Student ID</label>
                                </div>
                            </div>
                            <div class="col-5">
                                <select id="stdScore" class="form-select border shadow-0 h-100">
                                    <option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="small fw-bold">Select Feedback (Up to 3):</label>
                        <span id="tagCounter" class="badge badge-primary">0/3 selected</span>
                    </div>
                    <div class="choice-grid mb-4">
                        ${choices.map((e => `<div class="choice-tag" onclick="toggleTag(this, '${e}')">${e}</div>`)).join("")}
                    </div>
                    <div class="d-grid gap-2">
                        <button onclick="submitReview('${t.id}')" id="submitBtn" class="btn btn-primary shadow-0 py-2">POST REVIEW</button>
                        <button type="button" class="btn btn-danger btn-sm text-white" data-mdb-dismiss="modal">CANCEL</button>
                    </div>
                </div>
            </div>`,
        document.querySelectorAll(".form-outline").forEach((e => new mdb.Input(e).init())),
        myModal.show();
    }

    async function submitReview(e) {
        const t = document.getElementById("submitBtn"), n = document.getElementById("stdId").value.trim(), s = selectedTags.join(", "), a = new Date(),
        i = `${a.toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"}).replace(/ /g, "-")} ${a.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit", hour12: !0})}`;

        const storedID = localStorage.getItem("registeredStudentId");

        if (!n) {
            return Swal.fire({ icon: "warning", title: "Missing ID", text: "Please enter your Student ID." });
        }

        if (storedID && storedID !== n) {
        const idX = storedID.substring(0, 2)+"***"+storedID.slice(-2);
            return Swal.fire({
                icon: "error",
                title: "Access Denied",
                text: `You can't use others ID excepts this : ${idX}.`,
        footer: 'Try to give actual fair review!'
            });
        }

        if (0 === selectedTags.length) {
            return Swal.fire({ icon: "warning", title: "Missing Info", text: "Please select at least one feedback tag." });
        }

        t.innerText = "Processing...", t.disabled = !0;

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({
                    facultyId: e,
                    studentId: n,
                    user: document.getElementById("stdName").value.trim() || "Anonymous" + n.substring(0, 2) + n.slice(-2),
                    score: parseInt(document.getElementById("stdScore").value),
                    text: s + "<p class='text-muted' style='font-size: 0.6em; margin:0;'>" + i + "</p>"
                })
            });
            
            const result = await response.text();

            if ("Success" === result) {
                if (!storedID) localStorage.setItem("registeredStudentId", n);
                Swal.fire({
                    icon: "success",
                    title: "Review Posted!",
                    text: "Thank you for your feedback.",
                    showConfirmButton: !1,
                    timer: 2e3
                }).then(() => location.reload());
            } else if ("Duplicate" === result) {
                Swal.fire({ icon: "error", title: "Denied", text: "You have already reviewed this teacher." });
                resetBtn(t);
            } else {
                Swal.fire({ icon: "error", title: "Invalid ID", text: "This Student ID is not authorized." });
                resetBtn(t);
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: "Could not connect to server." });
            resetBtn(t);
        }
    }

    function resetBtn(e) { e.innerText = "POST REVIEW", e.disabled = !1; }

    document.addEventListener("DOMContentLoaded", (() => {
        myModal = new mdb.Modal(document.getElementById("facultyModal")),
        fetchData();
    }));

    document.getElementById("searchInput").addEventListener("keyup", (function() {
        const e = this.value.toLowerCase();
        displayFaculty(facultyData.filter((t => t.name.toLowerCase().includes(e) || t.dept.toLowerCase().includes(e))))
    }));
