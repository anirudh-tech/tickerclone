//show eye in password in user signup
$(document).ready(function () { 
  $("#showPasswordOne").click(function () {
    var passwordField = $("#password");
    var fieldType = passwordField.attr("type");

    if (fieldType === "password") {
      passwordField.attr("type", "text");
    } else {
      passwordField.attr("type", "password");
    }
  });

  $('#password').on('input', function () {
    const password = $(this).val();
    if (/\s/.test(password)) {
      $('#password-whitespace-msg').text('Password cannot contain white spaces');
  } else {
      $('#password-whitespace-msg').text('');
  }
})

  let currentPage = 1; // Starting page
  const perPage = 10; // Number of items per page

  // Function to update pagination info
  function updatePagination(totalCount) {
    const start = (currentPage - 1) * perPage + 1;
    const end = Math.min(currentPage * perPage, totalCount);

    const paginationInfo = `Showing ${start}-${end} results from ${totalCount}`;
    $("#pagination-info").text(paginationInfo);
  }

  // Simulate adding new data (e.g., after data insertion)
  function addNewData() {
    // Increment the totalCount (e.g., when new data is added)
    const totalCount = 13; // Update this value as new data is added

    // Update pagination info
    updatePagination(totalCount);

    // Check if there are more pages to show
    if (currentPage * perPage < totalCount) {
      currentPage++; // Increment current page if there are more results
    }
  }


  $("#showPasswordTwo").click(function () {
    var confirmPasswordInput = $("#confirmPassword");
    if (confirmPasswordInput.attr("type") === "password") {
      confirmPasswordInput.attr("type", "text");
    } else {
      confirmPasswordInput.attr("type", "password");
    }
  });

  $("#confirmPassword").on("keyup", function () {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();

    if (password === confirmPassword) {
      $("#password, #confirmPassword").removeClass("is-invalid");
    } else {
      $("#password, #confirmPassword").addClass("is-invalid");
    }
  });

  

  const minusBtn = $("#minusBtn");
  const plusBtn = $("#plusBtn");
  const countInput = $("#count");

  // Initial count value
  let count = 0;

  minusBtn.on("click", function () {
    if (count > 0) {
      count--;
      countInput.val(count);
    }
  });

  plusBtn.on("click", function () {
    count++;
    countInput.val(count);
  });

  $("#addProduct").on("click", function (event) {
    event.preventDefault();
    window.location.href = "/admin/addproduct";
  });

  $('input[name="ProductType"]').change(function () {
    if ($(this).val() === "watches") {
      $("#watchColorInput").show();
      $("#perfumeQuantityDropdown").hide();
    } else if ($(this).val() === "perfumes") {
      $("#perfumeQuantityDropdown").show();
      $("#watchColorInput").hide();
    } else {
      $("#watchColorInput").hide();
      $("#perfumeQuantityDropdown").hide();
    }
  });

  $('input[name = "discountType"').change(function () {
    if($(this).val() === "percentage") {
      console.log("inside percentage radio");
      $('#percentageFields').show();
      $('#fixedFields').hide();
    }else if($(this).val() === "fixed") {
      $('#fixedFields').show();
      $('#percentageFields').hide();
    }
  })

  $('input[name = "applyType"').change(function (){
    if($(this).val() === "categories"){
      console.log("inside categories radio");
      $('#categoriesList').show()
    }else if($(this).val() === "all"){
      $('#categoriesList').hide()
    }
  })



  const fileInput = $("#productImage");
  const uploadedImages = [
    $("#uploadedImage1"),
    $("#uploadedImage2"),
    $("#uploadedImage3"),
  ];

  fileInput.change(function () {
    const files = fileInput[0].files;

    // Show delete buttons for uploaded images
    for (let i = 0; i < uploadedImages.length; i++) {
      if (i < files.length) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
          // Set the src attribute of the corresponding <img> element
          uploadedImages[i].attr("src", e.target.result);
        };

        reader.readAsDataURL(file);

        // Show the delete button
        $('.delete-image[data-index="' + (i + 1) + '"]').show();
      } else {
        uploadedImages[i].attr("src", ""); // Clear the src attribute
        // Hide the delete button
        $('.delete-image[data-index="' + (i + 1) + '"]').hide();
      }
    }
  });
  // Add event listener to the "Delete" buttons
  $(".delete-image").click(function (event) {
    event.preventDefault();
    const index = $(this).data("index");
    uploadedImages[index - 1].attr("src", ""); // Clear the image
    fileInput.val(""); // Clear the file input
    // Hide the delete button
    $(this).hide();
  });

  $("#password").on("input", function () {
    var password = $(this).val();
    var strength = 0;

    // Check length
    if (password.length >= 8) {
      strength += 1;
    }

    // Check for uppercase and lowercase characters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      strength += 1;
    }

    // Check for digits
    if (/\d/.test(password)) {
      strength += 1;
    }

    // Check for special characters
    if (/[^a-zA-Z\d]/.test(password)) {
      strength += 1;
    }

    // Provide feedback based on strength
    var strengthText = "";
    switch (strength) {
      case 0:
        strengthText = "Very Weak";
        $("#strength").removeClass().addClass("very-weak");
        break;
      case 1:
        strengthText = "Weak";
        $("#strength").removeClass().addClass("weak");
        break;
      case 2:
        strengthText = "Moderate";
        $("#strength").removeClass().addClass("moderate");
        break;
      case 3:
        strengthText = "Strong";
        $("#strength").removeClass().addClass("strong");
        break;
      case 4:
        strengthText = "Very Strong";
        $("#strength").removeClass().addClass("very-strong");
        break;
    }

    $("#strength").text("Strength: " + strengthText);
  });

  let duration = 30; // Duration in seconds
  const timerDisplay = $("#timer");
  const resendOtp = $("#resendOtp");

  function updateTimer() {
    const minutes = Math.floor(duration / 60);
    let seconds = duration % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerDisplay.text(`${minutes}:${seconds}`);

    if (duration === 0) {
      clearInterval(countdown);
      timerDisplay.text("00:00");
      resendOtp.css("display", "block");
    } else {
      duration--;
    }
  }

  // Initial call to display the full minute
  updateTimer();

  // Set up the countdown
  const countdown = setInterval(updateTimer, 1000);


  
  var verifyButton = $("#emailVerification");
  var otpLabel = $("#otpLabel");

  // Attach a click event handler to the Verify button
  verifyButton.click(function () {
    // Show the OTP label when the button is clicked
    otpLabel.css("display", "block");
  });

    // Handle click event to set the active state
    $('.list-group-item').click(function() {
      $('.list-group-item').removeClass('active');
      $(this).addClass('active');
    });


  
  const fileInputs = $("#categoryImage");
  const uploadedImage = $("#uploadedImage");
  const deleteButton = $(".deletes-image");

  fileInputs.on("change",function () {
    const files = fileInputs[0].files;

    // Show delete buttons for uploaded images
   
      if (files.length > 0) {
        const file = files[0]
        const reader = new FileReader();

        reader.onload = function (e) {
          // Set the src attribute of the corresponding <img> element
          uploadedImage.attr("src", e.target.result);
          deleteButton.show();
        };

        reader.readAsDataURL(file);

      } else {
        uploadedImage.attr("src", "");
        deleteButton.hide();
    }
  });
  // Add event listener to the "Delete" buttons
    deleteButton.click(function (event) {
    event.preventDefault();
    uploadedImage.attr("src", ""); 
    fileInputs.val("");
    deleteButton.hide();
  });
 
});


