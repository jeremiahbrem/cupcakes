from unittest import TestCase

from app import app
from models import db, Cupcake

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_test'
app.config['SQLALCHEMY_ECHO'] = False

app.config['TESTING'] = True

db.drop_all()
db.create_all()


CUPCAKE_DATA = {
    "flavor": "TestFlavor",
    "size": "TestSize",
    "rating": 5,
    "image": "http://test.com/cupcake.jpg"
}

CUPCAKE_DATA_2 = {
    "flavor": "TestFlavor2",
    "size": "TestSize2",
    "rating": 10,
    "image": "http://test.com/cupcake2.jpg"
}


class CupcakeViewsTestCase(TestCase):
    """Tests for views of API."""

    def setUp(self):
        """Make demo data."""

        Cupcake.query.delete()

        cupcake = Cupcake(**CUPCAKE_DATA)
        db.session.add(cupcake)
        db.session.commit()

        self.cupcake = cupcake

    def tearDown(self):
        """Clean up fouled transactions."""

        db.session.rollback()

    def test_list_cupcakes(self):
        """Testing if cupcake list data is retreived as JSON"""

        with app.test_client() as client:
            resp = client.get("/api/cupcakes")

            self.assertEqual(resp.status_code, 200)

            data = resp.json
            self.assertEqual(data, {
                "cupcakes": [
                    {
                        "id": self.cupcake.id,
                        "flavor": "TestFlavor",
                        "size": "TestSize",
                        "rating": 5,
                        "image": "http://test.com/cupcake.jpg"
                    }
                ]
            })

    def test_get_cupcake(self):
        """Testing if cupcake data is retrieved as JSON"""

        with app.test_client() as client:
            url = f"/api/cupcakes/{self.cupcake.id}"
            resp = client.get(url)

            self.assertEqual(resp.status_code, 200)
            data = resp.json
            self.assertEqual(data, {
                "cupcake": {
                    "id": self.cupcake.id,
                    "flavor": "TestFlavor",
                    "size": "TestSize",
                    "rating": 5,
                    "image": "http://test.com/cupcake.jpg"
                }
            })

    def test_create_cupcake(self):
        """ Testing if cupcake is created and new cupcake data returned as JSON"""

        with app.test_client() as client:
            resp = client.post("/api/cupcakes", json=CUPCAKE_DATA_2)

            self.assertEqual(resp.status_code, 201)

            data = resp.json

            self.assertIsInstance(data['cupcake']['id'], int)
            del data['cupcake']['id']

            self.assertEqual(data, {
                "cupcake": {
                    "flavor": "TestFlavor2",
                    "size": "TestSize2",
                    "rating": 10,
                    "image": "http://test.com/cupcake2.jpg"
                }
            })

            self.assertEqual(Cupcake.query.count(), 2)
    
    def test_update_cupcake(self):
        """Testing if cupcake data is updated and returned as JSON"""
        
        with app.test_client() as client:
            url = f"/api/cupcakes/{self.cupcake.id}"
            resp = client.patch(url, json=
                                {
                                    "flavor": "black cherry",
                                    "size": "medium",
                                    "rating": 7,
                                })

            self.assertEqual(resp.status_code, 200)

            data = resp.json

            self.assertEqual(data, {
                "cupcake": {
                    "id": self.cupcake.id,
                    "flavor": "black cherry",
                    "size": "medium",
                    "rating": 7,
                    "image": "http://test.com/cupcake.jpg"
                }
            })

    def test_delete_cupcake(self):   
        """Testing if cupcake is deleted from database"""

        with app.test_client() as client:
            url = f"/api/cupcakes/{self.cupcake.id}"
            resp = client.delete(url)

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(Cupcake.query.count(), 0)
            self.assertEqual(Cupcake.query.get(self.cupcake.id), None)

    def test_get_404(self):
        """Testing if 404 is returned with non-existent cupcake query"""

        with app.test_client() as client:
            resp = client.get("/api/cupcakes/1000")
            self.assertEqual(resp.status_code, 404)

            resp = client.patch("/api/cupcakes/1000", json=
                                {
                                    "flavor": "black cherry",
                                    "size": "medium",
                                    "rating": 7,
                                })
            self.assertEqual(resp.status_code, 404)                    
            
            resp = client.delete("/api/cupcakes/1000")
            self.assertEqual(resp.status_code, 404)

    def test_search_flavors(self):
        """Testing flavor search view"""
        
        with app.test_client() as client:

            resp = client.get("/api/cupcakes/search?flavor=TestFlavor")
            data = resp.json
            print(Cupcake.query.all())

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(data, {
                "cupcakes": [{
                    "id": self.cupcake.id,
                    "flavor": "TestFlavor",
                    "size": "TestSize",
                    "rating": 5,
                    "image": "http://test.com/cupcake.jpg"
                }]
            })



