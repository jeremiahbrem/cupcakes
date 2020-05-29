// creates instance of a cupcake
class Cupcake {
  constructor(id, flavor, size, image, rating) {
    this.id = id;
    this.flavor = flavor;
    this.size = size;
    this.image = image;
    this.rating = rating;
  }

  // creates Cupcake instances from api response and returns array of all cupcakes
  static async fetchAllCupcakes() {
    const cupcakes = [];
    const response = await axios.get("http://localhost:5000/api/cupcakes");
    for (let cupcake of response.data.cupcakes) {
      let newCupcake = new Cupcake(
        cupcake.id,
        cupcake.flavor,
        cupcake.size,
        cupcake.image,
        cupcake.rating
      );
      cupcakes.push(newCupcake);
      
    }
    return cupcakes;
  }

  // retrieves particular cupcake from api and returns a Cupcake instance
  static async fetchCupcake(id) {
    const response = await axios.get(
      `http://localhost:5000/api/cupcakes/${id}`
    );
    const getCupcake = response.data.cupcake;
    const cupcake = new Cupcake(
      getCupcake.id,
      getCupcake.flavor,
      getCupcake.size,
      getCupcake.image,
      getCupcake.rating
    );
    return cupcake;
  }

  // submits new cupcake input data to api and returns a new Cupcake instance
  static async createCupcake(inputs) {
    const response = await axios.post("http://localhost:5000/api/cupcakes", {
      flavor: inputs.flavor,
      size: inputs.size,
      image: inputs.image,
      rating: inputs.rating,
    });
    const getCupcake = response.data.cupcake;
    const newCupcake = new Cupcake(
      getCupcake.id,
      getCupcake.flavor,
      getCupcake.size,
      getCupcake.image,
      getCupcake.rating
    );
    return newCupcake;
  }

  // submits updated cupcake data to api, updates Cupcake instance properties
  async updateCupcake(data) {
    const response = await axios.patch(
      `http://localhost:5000/api/cupcakes/${this.id}`,
      data
    );
    const cupcake = response.data.cupcake;
    this.id = cupcake.id;
    this.flavor = cupcake.flavor;
    this.size = cupcake.size;
    this.image = cupcake.image;
    this.rating = cupcake.rating;
  }

  // deletes Cupcake from api database and cupcake array
  async deleteCupcake() {
    const response = await axios.delete(
      `http://localhost:5000/api/cupcakes/${this.id}`
    );
  }

  // submits flavor query to api and returns cupcake ids
  static async searchFlavor(flavor) {
    const response = await axios.get(
      `http://localhost:5000/api/cupcakes/search?flavor=${flavor}`
    );
    const ids = [];
    for (let cupcake of response.data.cupcakes) {
      ids.push(cupcake.id);
    }
    return ids;
  }
}

class FormError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class EmptyInputError extends FormError {
  constructor(input) {
    super(`Please enter ${input}`);
  }
}

class InvalidRatingError extends FormError {
  constructor(message) {
    super("Please enter Rating from 1 to 10");
  }
}

class InvalidSizeError extends FormError {
  constructor(message) {
    super("Sizes include small, medium, or large");
  }
}
