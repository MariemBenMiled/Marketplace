import React from 'react';

const Blog = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center display-4 mb-4">Our Blog</h1>
      <p className="text-center lead mb-5">
        Discover the latest fashion trends and style tips to elevate your wardrobe.
      </p>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-light">
            <img
              src="https://media.glamour.com/photos/623b8f5646744aec636e2c7c/master/w_1920,c_limit/3-22-spring-style-trends.jpg"
              className="card-img-top"
              alt="Spring Fashion"
            />
            <div className="card-body">
              <h5 className="card-title">Spring Fashion</h5>
              <p className="card-text">Explore the vibrant colors and patterns of this Spring .</p>
              <a href="#" className="btn btn-primary">Read More</a>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-light">
            <img
              src="https://static.vecteezy.com/system/resources/previews/050/809/349/non_2x/beautiful-stylish-models-showcasing-the-latest-fashion-trends-photo.jpeg"
              className="card-img-top"
              alt="Fashion Trend 2"
            />
            <div className="card-body">
              <h5 className="card-title">beautiful stylish models</h5>
              <p className="card-text">Discover the best ways to style your outfits this season.</p>
              <a href="#" className="btn btn-primary">Read More</a>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-light">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="card-img-top"
              alt="Fashion Trend 3"
            />
            <div className="card-body">
              <h5 className="card-title">Fall/Winter 2024/25 Fashion Trends</h5>
              <p className="card-text">Learn how to accessorize for every occasion.</p>
              <a href="#" className="btn btn-primary">Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
