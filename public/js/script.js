$(function () {

    const addressTypes = document.querySelectorAll(".address-type");
    const formContents = document.querySelectorAll(".form-content")

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

                document.getElementById("tbody").innerHTML="";

            })

        })
    }


    const latlongForm = document.getElementById("latlong-form");
    if (latlongForm) {
        latlongForm.addEventListener("submit", function (event) {
            event.preventDefault();
            errorBox.style.display="none";
            const lat = document.getElementById("lat").value;
            const long = document.getElementById("long").value;
            const postData = {
                type: 'latlong',
                lat,
                long
            };

            $.post("/api/network", postData)
                .done(function (data) {

                    const location = data.loc;
                    const networkStatus =data.netstatus;

                    if (data.status === 0) {
                        const site_info = data.site;
                        let tableBody = "";
                        for (let i = 0; i < 5; i++) {
                            let values
                            switch (i) {
                                case 0:
                                    values = `<td>Location</td><td>${location}</td>`;
                                    break;
                                case 1:
                                    values = `<td>Network Coverage</td><td>${networkStatus}</td>`;
                                    break;

                                case 2:
                                    values = `<td>Serving Site Name</td><td>${site_info.name}</td>`;
                                    break;
                                case 3:
                                    values = `<td>Service Site Id</td><td>${site_info.site_id}</td>`;
                                    break;

                                case 4:
                                    values = `<td>Service Site Status</td><td>${site_info.status === 'online' ? 'In-Service' : 'Out-Of-Service'}</td>`;
                                    break;


                            }

                            tableBody += `<tr>${values}</tr>`


                        }

                        const table_Tbody = document.getElementById("tbody");
                        table_Tbody.innerHTML = tableBody;

                    } else if (data.status){
                        let tableBody = "";
                        for (let i = 0; i < 5; i++) {
                            let values
                            switch (i) {
                                case 0:
                                    values = `<td>Location</td><td>${location}</td>`;
                                    break;
                                case 1:
                                    values = `<td>Network Coverage</td><td>POOR</td>`;
                                    break;

                                case 2:
                                    values = `<td>Serving Site Name</td><td></td>`;
                                    break;
                                case 3:
                                    values = `<td>Service Site Id</td><td></td>`;
                                    break;

                                case 4:
                                    values = `<td>Service Site Status</td><td></td>`;
                                    break;


                            }

                            tableBody += `<tr>${values}</tr>`;


                        }

                        const table_Tbody = document.getElementById("tbody");
                        table_Tbody.innerHTML = tableBody;


                    }else if (data.error){
                        errorMessage.innerHTML =data.message.toString();
                        errorBox.style.display="block";
                        document.getElementById("tbody").innerHTML="";
                    }


                }).fail(function (error) {
                errorMessage.innerHTML ="No Network. Please check internet connection and try again";
                errorBox.style.display="block";
                document.getElementById("tbody").innerHTML="";





            })


        })
    }

    const ghpostForm = document.getElementById("gh-post-form");
    if (ghpostForm){
        const progressIndicator = document.getElementById("progressIndicator")
        ghpostForm.addEventListener("submit", function (event) {
            event.preventDefault();
            progressIndicator.style.display="block";
            errorBox.style.display="none";
            const ghpost = document.getElementById("ghanapost-code").value;
            const postData = {
                type: 'ghanapost',
                ghpost

            };

            $.post("/api/network", postData)
                .done(function (data) {
                    progressIndicator.style.display="none"

                    const location = data.loc;
                    const networkStatus =data.netstatus;
                    const area = data.area

                    if (data.status === 0) {
                        const site_info = data.site;
                        let tableBody = "";
                        for (let i = 0; i < 5; i++) {
                            let values
                            switch (i) {
                                case 0:
                                    values = `<td>Location</td><td>${location}</td>`;
                                    break;

                                case 1:
                                    values = `<td>Area</td><td>${area}</td>`;
                                    break;

                                case 2:
                                    values = `<td>Network Coverage</td><td>${networkStatus}</td>`;
                                    break;

                                case 3:
                                    values = `<td>Serving Site Name</td><td>${site_info.name}</td>`;
                                    break;
                                case 4:
                                    values = `<td>Serving Site Id</td><td>${site_info.site_id}</td>`;
                                    break;

                                case 5:
                                    values = `<td>Serving Site Status</td><td>${site_info.status === 'online' ? 'In-Service' : 'Out-Of-Service'}</td>`;
                                    break;


                            }

                            tableBody += `<tr>${values}</tr>`


                        }

                        const table_Tbody = document.getElementById("tbody");
                        table_Tbody.innerHTML = tableBody;

                    } else if (data.status) {
                        let tableBody = "";
                        for (let i = 0; i < 5; i++) {
                            let values
                            switch (i) {
                                case 0:
                                    values = `<td>Location</td><td>${location}</td>`;
                                    break;
                                case 1:
                                    values = `<td>Network Coverage</td><td>POOR</td>`;
                                    break;

                                case 2:
                                    values = `<td>Serving Site Name</td><td></td>`;
                                    break;
                                case 3:
                                    values = `<td>Serving Site Id</td><td></td>`;
                                    break;

                                case 4:
                                    values = `<td>Serving Site Status</td><td></td>`;
                                    break;


                            }

                            tableBody += `<tr>${values}</tr>`;


                        }

                        const table_Tbody = document.getElementById("tbody");
                        table_Tbody.innerHTML = tableBody;


                    }else if (data.error) {
                        errorMessage.innerHTML =data.message.toString();
                        errorBox.style.display="block";
                        document.getElementById("tbody").innerHTML="";


                    }


                }).fail(function (error) {
                    errorMessage.innerHTML ="No Network. Please check internet connection and try again";
                    errorBox.style.display="block";
                document.getElementById("tbody").innerHTML="";



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


})
