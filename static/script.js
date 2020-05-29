let cupcakes = [];
showPage();

async function showPage() {
  await getCupcakes();

  // retrieves all cupcakes and displays on page
  async function getCupcakes() {
    cupcakes = await Cupcake.fetchAllCupcakes();
    $(".cupcake_list").html("");
    if (cupcakes) {
      for (let cupcake of cupcakes) {
        showCupcake(cupcake);
      }
      addEditClick();
    }
    window.scrollTo(0, 0);
  }

  // adds click handler to Cupcake List link
  $("#list").on("click", async function() {
    restoreCupcakeList();
    await getCupcakes();
  })

  // adds click handler to New Cupcake add button
  $("#add").on("click", newCupcake);

  // adds click handler to search button
  $("#search").on("click", () => {
    $(".cupcake_list").html("");
    getFlavor($("#search_flavor").val());
    $("#search_flavor").val("");
  });

  // adds click handler to Edit Cupcake save button
  $("#save").on("click", editCupcake);

  // adds click handler to Cupcake delete button
  $("#delete").on("click", deleteCupcake);

  // displays cupcake image and details
  function showCupcake(cupcake) {
    $(".cupcake_list").append(`<div id=${cupcake.id} class="cupcakes">
                          <img src=${cupcake.image}>
                          <p>Flavor: &nbsp&nbsp${cupcake.flavor}</p>
                          <p>Size: &nbsp&nbsp${cupcake.size}</p>
                          <p>Rating:&nbsp&nbsp${cupcake.rating}</p>
                          <button id=${cupcake.id} class="edit_btn">Edit</button>
                          </div>`);
  }

  // adds click handler to Cupcake edit button and displays single cupcake with edit form
  function addEditClick() {
    $(".edit_btn").on("click", function (evt) {
      evt.preventDefault();
      id = evt.target.id;
      const filtered = cupcakes.filter((c) => c.id == id);
      const cupcake = filtered[0];
      $(".cupcake_list").html("");
      $(".cupcake_side").css("width", "250px");
      $("#add").hide();
      $("h2").text("Edit Cupcake");
      $("#flavor_input").val(cupcake.flavor);
      $("#size_input").val(cupcake.size);
      $("#image_input").val(cupcake.image);
      $("#rating_input").val(cupcake.rating);
      $(".update").show();
      showCupcake(cupcake);
      $(".edit_btn").hide();
      
    });
  }

  // restores full cupcake list and clears form
  function restoreCupcakeList() {
    $("h2").text("Add Cupcake");
    $(".update").hide();
    $("#add").show();
    $("a").show();
    $(".edit_btn").show();
    $(".cupcake_side").css("width", "800px");
    $("#flavor_input").val("");
    $("#size_input").val("");
    $("#image_input").val("");
    $("#rating_input").val("");
  }

  // sends Add Cupcake form data to api and retrieves new cupcake
  async function newCupcake(evt) {
    evt.preventDefault();
    let cupcake;
    let inputs = {
      flavor: $("#flavor_input").val(),
      size: $("#size_input").val(),
      image: $("#image_input").val(),
      rating: $("#rating_input").val(),
    };
    try {
      checkForm(inputs);
      cupcake = await Cupcake.createCupcake(inputs);
      await getCupcakes();
      showMessage("Cupcake added.")
      $("#flavor_input").val("");
      $("#size_input").val("");
      $("#image_input").val("");
      $("#rating_input").val("");
    } catch (err) {
      alert(err.message);
    }
  }

  function showMessage(message) {
    $("#message").text(`${message}`);
    setTimeout(()=> {
      $('#message').text("");
    }, 2000)
  }

  // submits flavor query to api and retrieves search
  async function getFlavor(flavor) {
    ids = await Cupcake.searchFlavor(flavor);
    console.log(ids)
    if (ids.length > 0) {
      let filteredCupcakes = cupcakes.filter((c) => ids.includes(c.id));
      $(".cupcake_list").html("");
      for (let cupcake of filteredCupcakes) {
        showCupcake(cupcake);
      }
      addEditClick();
    }
    else {
      showMessage("None found.");
    }
  }

  // deletes cupcake from api database and from cupcakes array
  async function deleteCupcake() {
    const id = $(".cupcakes").attr("id");
    const filtered = cupcakes.filter((cupcake) => cupcake.id == id);
    const cupcake = filtered[0];
    await cupcake.deleteCupcake();
    showMessage("Cupcake deleted.")
    cupcakes = cupcakes.filter((c) => c.id != id)
    restoreCupcakeList();
    await getCupcakes();
  }

  // submits input data to api database and retrieves the updated cupcake
  async function editCupcake(evt) {
    evt.preventDefault();
    let data = {};
    const id = $(".cupcakes").attr("id");
    const filtered = cupcakes.filter((cupcake) => cupcake.id == id);
    const cupcake = filtered[0];
    let inputs = {
      flavor: $("#flavor_input").val(),
      size: $("#size_input").val(),
      image: $("#image_input").val(),
      rating: $("#rating_input").val(),
    };
    try {
      checkForm(inputs);
      for (let key in inputs) {
        if (inputs[key]) {
          data[key] = inputs[key];
        }
      }
      await cupcake.updateCupcake(data); 
      restoreCupcakeList();
      await getCupcakes();
      showMessage("Cupcake updated.")
    } catch (err) {
      alert(err.message);
    }
  }

  // checks for valid form inputs
  function checkForm(inputs) {
    let inputKeys = Object.keys(inputs);
    for (let key of inputKeys) {
      if (!inputs[key]) {
        throw new EmptyInputError(key);
      }
    }
    if (inputs.rating < 1 || inputs.rating > 10) {
      throw new InvalidRatingError();
    }
    const sizes = ["small", "medium", "large"];
    if (!sizes.includes(inputs.size)) {
      throw new InvalidSizeError();
    }
  }
}
