$(function () {

    const addressTypes = document.querySelectorAll(".address-type");
    const formContents = document.querySelectorAll(".form-content")
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
                                    values = `<td>Network Coverage</td><td>EXCELLENT</td>`;
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

                    } else {
                        let tableBody = "";
                        for (let i = 0; i < 5; i++) {
                            let values
                            switch (i) {
                                case 0:
                                    values = `<td>Location</td><td>${location}</td>`;
                                    break;
                                case 1:
                                    values = `<td>Network Coverage</td><td>Not AVAILABLE</td>`;
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


                    }


                }).fail(function (error) {



            })


        })
    }


})
