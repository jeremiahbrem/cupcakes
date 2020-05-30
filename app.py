from flask import Flask, render_template, request, redirect, jsonify
from models import db, connect_db, Cupcake
from sqlalchemy import desc

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.drop_all()

db.create_all()

app.config['SECRET_KEY'] = "12h68sy4u65gf1h65dfj48"

@app.route("/")
def show_list_page():
    """Returns the HTML cupcake list page"""

    return render_template("index.html")

@app.route("/api/cupcakes")
def list_cupcakes():
    """Return JSON {cupcakes: [{id, flavor, size, rating, image}, ...]}"""

    cupcakes = Cupcake.query.order_by(desc("id")).all()
    serialized = [c.serialize() for c in cupcakes]

    return jsonify(cupcakes=serialized)

@app.route("/api/cupcakes/<int:cupcake_id>")   
def get_cupcakes(cupcake_id):
    """Return JSON {cupcake: [{id, flavor, size, rating, image}, ...]}"""

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()

    return jsonify(cupcake=serialized)

@app.route("/api/cupcakes", methods=["POST"])
def create_cupcake():
    """Create dessert from form data & return it.
    Returns JSON {'cupcake': {id, flavor, size, rating, image}}
    """

    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    image = request.json["image"]

    new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)

    db.session.add(new_cupcake)
    db.session.commit()
    # get_cupcake = Cupcake.query.order_by(desc(Cupcake.id)).limit(1)

    serialized = new_cupcake.serialize()

    return (jsonify(cupcake=serialized), 201)

@app.route('/api/cupcakes/<int:cupcake_id>', methods=["PATCH"])
def update_cupcake(cupcake_id):
    """Updates a particular cupcake and responds w/ JSON of that updated cupcake"""
    
    updated_cupcake = Cupcake.query.get_or_404(cupcake_id)
    updated_cupcake.flavor = request.json.get('flavor', updated_cupcake.flavor)
    updated_cupcake.size = request.json.get('size',  updated_cupcake.size)
    updated_cupcake.rating = request.json.get('rating',  updated_cupcake.rating)
    updated_cupcake.image = request.json.get('image',  updated_cupcake.image)

    db.session.add(updated_cupcake)
    db.session.commit()

    serialized = updated_cupcake.serialize()

    return (jsonify(cupcake=serialized), 200)

@app.route('/api/cupcakes/<int:cupcake_id>', methods=["DELETE"])
def delete_cupcake(cupcake_id):
    """Deletes a particular cupcake"""
    
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()
    
    return (jsonify(message="deleted"), 200)   

@app.route('/api/cupcakes/search')    
def search_flavors():
    """Returns search flavor data"""

    search_flavor = request.args.get("flavor")
    cupcakes = Cupcake.query.filter(Cupcake.flavor.ilike(search_flavor)).all()
    serialized = [cupcake.serialize() for cupcake in cupcakes]
        
    return (jsonify(cupcakes=serialized))
    


