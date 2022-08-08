$(function () {

    const addressTypes = document.querySelectorAll(".address-type");
    const formContents = document.querySelectorAll(".form-content");

    const spanDistance = document.getElementById("span-distance");
    const spanSiteStatus = document.getElementById("span-site-status");
    const spanSiteName = document.getElementById("span-site-name");
    const spanSiteID = document.getElementById("span-site-id");
    const spanNetworkCov = document.getElementById("span-network-conv");
    const spanLocLatLong = document.getElementById("span-loc-latlong");
    const spanLocArea = document.getElementById("span-loc-area");

    const newContainer = document.getElementById("new-container");
    const contentContainer = document.getElementById("content-container")
    const infoContainer = document.getElementById("info-container")

    const errorBox = document.getElementById("error-box");
    const errorMessage = document.querySelector("#error-box small")
    if (addressTypes) {
        addressTypes.forEach(function (addressType) {
            addressType.addEventListener("click", function (event) {
                if (this.checked) {
                    const addressChecked = event.target;
                    const id = addressChecked.id;
                    if (formContents) {
                        formContents.forEach(function (formContent) {
                            if (formContent.classList.contains(id)) {
                                formContent.style.display = "block"
                            } else {
                                formContent.style.display = "none"

                            }

                        })
                    }


                }


                newContainer.style.display="none";
                infoContainer.style.display="none";
                contentContainer.style.display = "none";

            })

        })
    }


    const latlongForm = document.getElementById("latlong-form");
    if (latlongForm) {
        latlongForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const progressIndicator = document.getElementById("progressIndicatorlat");
            progressIndicator.style.display = "block"
            errorBox.style.display = "none";
            const lat = document.getElementById("lat").value;
            const long = document.getElementById("long").value;
            const postData = {
                type: 'latlong',
                lat,
                long
            };

            $.post("/coverage-checker/api/network", postData)
                .done(function (data) {
                    progressIndicator.style.display = "none"


                    if (data.status ===0) {
                        const location = data.loc;
                        const networkStatus = data.netstatus;
                        const distance = data.distance;

                        let {name: site_name, status: site_status, site_id} = data.site;

                        switch (networkStatus) {
                            case "EXCELLENT":
                            case "VERY GOOD":
                            case "GOOD":
                            case "FAIR":
                                spanNetworkCov.className = "bold green";
                                break;
                            case "POOR":
                            case "NO COVERAGE":
                                spanNetworkCov.className = "bold red";
                                break;
                        }

                        spanSiteStatus.className = site_status === "online" ? "bold green" : "bold red";

                        spanNetworkCov.textContent = networkStatus;
                        spanLocArea.textContent="";
                        spanDistance.textContent = `${distance}KM`;
                        spanLocLatLong.textContent = location;
                        spanSiteName.textContent = site_name;
                        spanSiteID.textContent = site_id;
                        spanSiteStatus.textContent = site_status === "online" ? "IN-SERVICE" : "OUT-OF-SERVICE";
                        newContainer.style.display = "flex";
                        infoContainer.style.display=site_status==="online"?"flex":"none";
                        contentContainer.style.display="flex";
                        contentContainer.scrollIntoView();

                    }  else if (data.error) {
                        errorMessage.innerHTML = data.message.toString();
                        errorBox.style.display = "block";
                        newContainer.style.display="none"
                        infoContainer.style.display="none";
                        contentContainer.style.display = "none";
                    }


                }).fail(function (error) {
                progressIndicator.style.display = "none"
                errorMessage.innerHTML = "No Network. Please check internet connection and try again";
                errorBox.style.display = "block";
                newContainer.style.display="none"
                infoContainer.style.display="none";
                contentContainer.style.display = "none";



            })


        })
    }

    const ghpostForm = document.getElementById("gh-post-form");
    if (ghpostForm) {
        const progressIndicator = document.getElementById("progressIndicator")
        ghpostForm.addEventListener("submit", function (event) {
            event.preventDefault();
            progressIndicator.style.display = "block";
            errorBox.style.display = "none";
            const ghpost = document.getElementById("ghanapost-code").value;
            const postData = {
                type: 'ghanapost',
                ghpost

            };

            $.post("/coverage-checker/api/network", postData)
                .done(function (data) {
                    progressIndicator.style.display = "none"


                    if (data.status === 0) {


                        const location = data.loc;
                        const networkStatus = data.netstatus;
                        const area = data.area;
                        const distance = data.distance;

                        let {name: site_name, status: site_status, site_id} = data.site;

                        switch (networkStatus) {
                            case "EXCELLENT":
                            case "VERY GOOD":
                            case "GOOD":
                            case "FAIR":
                                spanNetworkCov.className = "bold green";
                                break;
                            case "POOR":
                            case "NO COVERAGE":
                                spanNetworkCov.className = "bold red";
                                break;
                        }

                        spanSiteStatus.className = site_status === "online" ? "bold green" : "bold red";

                        spanNetworkCov.textContent = networkStatus;
                        spanDistance.textContent = `${distance}KM`;
                        spanLocArea.textContent = area;
                        spanLocLatLong.textContent = location;
                        spanSiteName.textContent = site_name;
                        spanSiteID.textContent = site_id;
                        spanSiteStatus.textContent = site_status === "online" ? "IN-SERVICE" : "OUT-OF-SERVICE";
                        newContainer.style.display = "flex";
                        infoContainer.style.display=site_status==="online"?"flex":"none";
                        contentContainer.style.display="flex";
                        contentContainer.scrollIntoView();


                    } else if (data.error) {
                        errorMessage.innerHTML = data.message.toString();
                        errorBox.style.display = "block";
                        newContainer.style.display = "none";
                        infoContainer.style.display="none";
                        contentContainer.style.display = "none";


                    }


                }).fail(function (error) {
                progressIndicator.style.display = "none"
                errorMessage.innerHTML = "No Network. Please check internet connection and try again";
                errorBox.style.display = "block";
                newContainer.style.display = "none";
                infoContainer.style.display="none";
                contentContainer.style.display = "none";


            })


        })

    }

    const timeButtonError = document.getElementById("times-button-error");
    if (timeButtonError) {
        timeButtonError.addEventListener("click", function (event) {
            const wrapper = timeButtonError.closest("div");
            wrapper.style.display = "none";

        })
    }


    const requestCallBackForm = document.getElementById("request-callback");
    const messageBox = document.getElementById("message-box");
    const messageText = document.getElementById("message-error");
    const callBtn = document.getElementById("callback-btn")
    if (requestCallBackForm){
        requestCallBackForm.addEventListener("submit", function (event) {
            event.preventDefault();

            callBtn.innerText="Please Wait ....."
            callBtn.style.background="#424242"
            callBtn.style.pointerEvents="none";
            messageBox.style.display="none"

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const contact=document.getElementById("contact").value;
            const message = document.getElementById("message").value;

            const postBody = {name,email,contact,message};

            $.post("/coverage-checker/api/message", postBody)
                .done(function (data) {

                    if (data.status ==="success" ) {
                        window.location.href ="/coverage-checker/contact-us-success";
                        callBtn.innerText="SEND"
                        callBtn.style.background="#0245A3";
                        callBtn.style.pointerEvents="auto"

                    } else if (data.error) {
                        callBtn.innerText="SEND"
                        callBtn.style.background="#0245A3";
                        callBtn.style.pointerEvents="auto"
                        messageText.innerText =data.message.toString()
                        messageBox.style.display="block"
                    }

                }).fail(function (error) {
                callBtn.innerText="SEND"
                callBtn.style.background="#0245A3";
                callBtn.style.pointerEvents="auto"
                messageText.innerText ="Please check your internet connection"
                messageBox.style.display="block"
            })


        })
    }



})
