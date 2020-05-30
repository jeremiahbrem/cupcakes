describe("Testing Cupcake class functions", () => {
  const cupcake1 = {
    flavor: "strawberry",
    size: "large",
    image:
      "https://i2.wp.com/recipegirl.com/wp-content/uploads/2017/07/Pink-Strawberry-Cupcakes.jpg",
    rating: 10,
  };
  const cupcake2 = {
    flavor: "chocolate",
    size: "medium",
    image:
      "https://www.lifeloveandsugar.com/wp-content/uploads/2017/05/Moist-Homemade-Chocolate-Cupcakes2.jpg",
    rating: 9,
  };
  let cupcakes = [];
  let newCupcake1;
  let newCupcake2;

  // setup each test function with created Cupcakes in database
  beforeEach(async () => {
    newCupcake1 = await Cupcake.createCupcake(cupcake1);
    cupcakes.push(newCupcake1);
    newCupcake2 = await Cupcake.createCupcake(cupcake2);
    cupcakes.push(newCupcake2);
  });

  it("should return new Cupcake instance created from api response with createCupcake", async () => {
    expect(newCupcake1).toBeInstanceOf(Cupcake);
    expect(newCupcake2).toBeInstanceOf(Cupcake);
    expect(newCupcake1.flavor).toEqual("strawberry");
  });

  it("should return all Cupcakes with fetchAllCupcakes", async () => {
    const allCupcakes = await Cupcake.fetchAllCupcakes();
    expect(allCupcakes.length).toEqual(2);
    for (let cupcake of allCupcakes) {
      expect(cupcake).toBeInstanceOf(Cupcake);
      expect(["strawberry", "chocolate"]).toContain(cupcake.flavor);
    }
  });

  it("should return a particular cupcake from api with fetchCupcake", async () => {
    const result = await Cupcake.fetchCupcake(cupcakes[0].id);
    expect(result.id).toEqual(cupcakes[0].id);
  });

  it("should return an updated Cupcake with updateCupcake", async () => {
    const data = {
      flavor: "mint",
      size: "small",
      rating: 7,
    };
    await newCupcake1.updateCupcake(data);
    expect(newCupcake1.flavor).toEqual("mint");
    expect(newCupcake1.image).toEqual("https://i2.wp.com/recipegirl.com/wp-content/uploads/2017/07/Pink-Strawberry-Cupcakes.jpg");
    expect(newCupcake1.rating).toEqual(7);
    expect(newCupcake1.size).toEqual("small");
  });

  it("should delete Cupcake from database", async () => {
      await newCupcake1.deleteCupcake();
      cupcakes = cupcakes.filter((c) => c.id != newCupcake1.id);
      const fetchedCupcakes = await Cupcake.fetchAllCupcakes();
      expect(fetchedCupcakes.length).toEqual(1);
      for (let cupcake of fetchedCupcakes) {
          expect(cupcake.id).not.toBe(newCupcake1.id);
      }
  });

  afterEach(async () => {
    for (let cupcake of cupcakes) {
      await cupcake.deleteCupcake();
    }
    cupcakes = [];
  });
});
