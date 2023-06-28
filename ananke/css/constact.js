
    const form = document.getElementById('contactForm');
    const status = document.getElementById("formStatus");
    let mark = false;

    function validateForm() {
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      // const message = form.querySelector('#message');
      const fileInput = form.querySelector('#upload');
      const file = fileInput.files[0];
      let noerr = true
      // Validate name
      if (name.value === '') {
        form.querySelector('[for=name] .error').innerHTML = 'Name required'
        name.focus();
        noerr = false
      } else {
        form.querySelector('[for=name] .error').innerHTML = ''
      }

      const emailRegex = /^[a-z0-9\u007F-\uffff!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
      // Validate email
      if (!emailRegex.test(email.value)) {
        form.querySelector('[for=email] .error').innerHTML = 'Please enter your email address.'
        noerr = false
      } else {
        form.querySelector('[for=email] .error').innerHTML = ''
      }

      // Validate file
      if (file) {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
        if (fileExtension === 'pdf') {
          mark = true
        } else {
          mark = false
        }
        if (!allowedExtensions.includes(fileExtension)) {
          form.querySelector('.upload .error').innerHTML = 'Only image files (jpg, jpeg, png) are allowed.'
          noerr = false
        }
      } else {
        form.querySelector('.upload .error').innerHTML = ''
      }

      return noerr;
    }

    async function handleSubmit(event) {
      event.preventDefault();

      if (!validateForm()) {
        return false;
      }

      if (mark) {
        location.replace('/qainterview/500.html')
        return false;
      }

      const data = new FormData(event.target);
      const btn = form.querySelector('[type=submit]');



      btn.setAttribute('disabled', 'true');

      fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          status.innerHTML = "Thanks John for contacting us!";
          form.reset()
        } else {
          response.json().then(data => {
            if (Object.hasOwn(data, 'errors')) {
              status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
            } else {
              status.innerHTML = "Oops! There was a problem submitting your form"
            }
          })
        }
        btn.removeAttribute('disabled');
      }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form"
        btn.removeAttribute('disabled');
      });
    }

    form.addEventListener("submit", handleSubmit)
