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
          const PROXY = "https://cors-anywhere.herokuapp.com/"; 
        const SCRIPT_URL = atob(atob("YUhSMGNITTZMeTl6WTNKcGNIUXVaMjl2WjJ4bExtTnZiUzl0WVdOeWIzTXZjeTlCUzJaNVkySjNXR1ZRTjNwMlJVazFjRWMwWDJKTVlsOUpUWHBQZUVGNk5TMXVSR0p0VFVvelNEVmFPSEJWYWt4cVlWcDRlVm94WTJkUWNrVkxWRTlLUTBoUGRWSnFSR0V2WlhobFl3PT0="));
        const BUBT_API = "https://bubt-api.onrender.com/verify?student_id=";
        
        let facultyData = [], selectedTags = [], authModal, detailModal, tempStudentData = null;
        const choices = ["Excellent Teaching", "Better Teaching", "Poor Teaching", "Fair Grading", "Unfair Grading", "Strict", "Friendly"];

        document.addEventListener("DOMContentLoaded", () => {
            authModal = new mdb.Modal(document.getElementById('authModal'));
            detailModal = new mdb.Modal(document.getElementById('facultyModal'));
            updateLoginStatus();
            fetchData();
        });

        async function fetchData() {
            try {
                const e = await fetch(SCRIPT_URL);
                facultyData = await e.json();
                document.getElementById("loading").classList.add("d-none");
                displayFaculty(facultyData);
            } catch (e) { document.getElementById("loading").innerText = "Sync Error."; }
        }

        function updateLoginStatus() {
            const isVerified = localStorage.getItem("token");
            const btn = document.getElementById("loginBtn");
            if (isVerified) {
                btn.innerHTML = `<i class="fas fa-check-circle text-success me-1"></i> Verified`;
                btn.classList.replace("btn-outline-primary", "btn-light");
                btn.onclick = null;
            }
        }

        function openAuthModal() { 
            document.getElementById("step1").style.display = "block";
            document.getElementById("step2").style.display = "none";
            document.getElementById("authId").value = "";
            document.getElementById("authPhone").value = "";
            authModal.show(); 
        }

        function checkIdLength(el) { if(el.value.length > 11) el.value = el.value.slice(0, 11); }

        async function verifyIdStep() {
            const id = document.getElementById("authId").value;
            if (id.length !== 11) return Swal.fire("Error", "Enter exactly 11 digits", "error");

            const btn = document.getElementById("verifyIdBtn");
            btn.disabled = true; btn.innerText = "Checking...";

            try {
                const res = await fetch(PROXY + BUBT_API + id);
                const data = await res.json();

                if (String(data.status) === "found") {
                    tempStudentData = data;
                    // Standardizing the phone number
                    let phone = String(data.student_mobile || data.phone_hint || "");
                    if (phone.length === 10) phone = "0" + phone;
                    
                    // Save full phone for step 2 matching
                    tempStudentData.fullPhoneMatch = phone;

                    const hint = phone.substring(0, 3) + "*******" + phone.slice(-1);
                    document.getElementById("phoneHint").innerText = hint;
                    document.getElementById("step1").style.display = "none";
                    document.getElementById("step2").style.display = "block";
                } else {
                    Swal.fire("Invalid", "ID not found, Please enter your correct ID.", "error");
                }
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'Connection Error',
                    text: 'Make sure you have requested Proxy Access.',
                    footer: '<a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">Click here to Request Access</a>'
                });
            } finally {
                btn.disabled = false; btn.innerText = "Next";
            }
        }

        function verifyPhoneStep() {
            const inputPhone = document.getElementById("authPhone").value;
            const actualPhone = tempStudentData.fullPhoneMatch;
            const yp = inputPhone.substring(0, 5)+inputPhone.slice(-1);
            const xp = actualPhone.substring(0, 5)+actualPhone.slice(-1);

            if (yp === xp) {
                localStorage.setItem("token", md5(tempStudentData.student_id));
                localStorage.setItem("plainId", tempStudentData.student_id);
                localStorage.setItem("userName", inputPhone);
                
                authModal.hide();
                updateLoginStatus();
                Swal.fire("Verified", "Access Granted!", "success");
            } else {
                Swal.fire("Mismatch", "The phone number you entered is incorrect.", "error");
            }
        }

        function displayFaculty(e) {
            document.getElementById("facultyGrid").innerHTML = e.map((e => {
                const t = e.reviews || [], n = t.length ? (t.reduce(((e, t) => e + t.score), 0) / t.length).toFixed(1) : "0.0";
                return `<div class="col-12 col-md-6 col-lg-4">
                    <div class="card faculty-card shadow-sm" onclick="openDetails('${e.id}')">
                        <div class="faculty-card-content">
                            <img src="${e.image}" class="custom-thumb" onerror="this.src='https://placehold.co/80'">
                            <div class="flex-grow-1">
                                <h6 class="fw-bold mb-1 small">${e.name}</h6>
                                <div class="dept-text mb-1">${e.dept}</div>
                                <div class="rating-stars">${renderStars(n)} <span class="text-dark ms-1">${n}</span></div>
                                <span class="small text-muted">(${t.length} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>`
            })).join("");
        }

        function openDetails(id) {
            const t = facultyData.find(x => String(x.id) === String(id));
            const isLogged = localStorage.getItem("token");
            const savedId = localStorage.getItem("plainId") || "";
            selectedTags = [];
            
            document.getElementById("modalBody").innerHTML = `
                <div class="row">
                    <div class="col-md-5 border-end">
                        <div class="d-flex mb-3 align-items-center">
                            <img src="${t.image}" class="custom-thumb me-2">
                            <div><h6 class="fw-bold mb-0 small">${t.name}</h6><small class="text-primary">${t.designation}</small></div>
                        </div>
                        <h6 class="small fw-bold border-bottom pb-2">Reviews</h6>
                        <div class="review-scroll">
                            ${(t.reviews || []).slice().reverse().map(r => `
                                <div class="mb-2 border-bottom pb-1">
                                    <div class="d-flex justify-content-between small"><b>${r.user.substring(0,9)}${Math.floor(Math.random() * 99) + 1}${r.user.slice(-2)}</b> <span>${renderStars(r.score)}</span></div>
                                    <p style="font-size:0.7rem" class="text-muted mb-0">${r.text}</p>
                                </div>
                            `).join('') || '<p class="small text-muted">No reviews yet.</p>'}
                        </div>
                    </div>
                    <div class="col-md-7">
                        <h6 class="fw-bold mb-3">Post Feedback</h6>
                        <div class="mb-3">
                            <div class="row g-2">
                                <div class="col-7">
                                    <div class="form-outline border rounded ${isLogged ? 'bg-light' : ''}" data-mdb-input-init>
                                        <input type="number" id="stdId" class="form-control" value="${savedId}" ${isLogged ? 'disabled' : 'disabled'} />
                                        <label class="form-label">Student ID</label>
                                    </div>
                                </div>
                                <div class="col-5">
                                    <select id="stdScore" class="form-select border shadow-0 h-100">
                                        <option value="5">5 Stars</option><option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="choice-grid mb-4">
                            ${choices.map(c => `<div class="choice-tag" onclick="toggleTag(this, '${c}')">${c}</div>`).join('')}
                        </div>
                        <button onclick="submitReview('${t.id}')" id="submitBtn" class="btn btn-primary w-100 shadow-0 py-2">POST REVIEW</button>
                        <button class="btn btn-danger w-100 shadow-0 mt-2 text-white" data-mdb-dismiss="modal">Cancel</button>
                    </div>
                </div>`;
            
            document.querySelectorAll(".form-outline").forEach(e => new mdb.Input(e).init());
            detailModal.show();
        }

        async function submitReview(facultyId) {
            const token = localStorage.getItem("token");
            if (!token) return Swal.fire("Required", "Please Verify ID first!", "warning");
            if (selectedTags.length === 0) return Swal.fire("Required", "Select at least 1 feedback tag", "info");

            const btn = document.getElementById("submitBtn");
            btn.innerText = "Posting..."; btn.disabled = true;
            
            const rawName = localStorage.getItem("userName")+"-"+localStorage.getItem("plainId") || "Student";
            const maskedName = "Anonymous" + rawName;

            const payload = {
                facultyId: facultyId,
                studentId: localStorage.getItem("plainId"),
                user: maskedName,
                score: parseInt(document.getElementById("stdScore").value),
                text: selectedTags.join(", ") + `<p class='text-muted' style='font-size:0.8em; margin:0;'>${new Date().toLocaleDateString()}</p>`
            };

            try {
                const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) });
                const result = await res.text();
                if (result === "Success") {
                    Swal.fire("Success", "Review posted!", "success").then(() => location.reload());
                } else {
                    Swal.fire("Denied", "Sorry you have already review this faculty!", "error");
                    btn.disabled = false; btn.innerText = "POST REVIEW";
                }
            } catch (e) {
                Swal.fire("Error", "Server connection failed", "error");
                btn.disabled = false; btn.innerText = "POST REVIEW";
            }
        }

        function toggleTag(el, tag) {
            if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
                el.classList.remove("active");
            } else {
                if (selectedTags.length >= 3) return Swal.fire("Limit", "Max 3 tags allowed", "info");
                selectedTags.push(tag);
                el.classList.add("active");
            }
        }

        function renderStars(e) {
            let t = "";
            for (let n = 1; n <= 5; n++) t += `<i class="${n <= Math.round(e) ? "fas" : "far"} fa-star"></i>`;
            return t;
        }

        document.getElementById("searchInput").addEventListener("keyup", function() {
            const e = this.value.toLowerCase();
            displayFaculty(facultyData.filter(t => t.name.toLowerCase().includes(e) || t.dept.toLowerCase().includes(e)));
        });
