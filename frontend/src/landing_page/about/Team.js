import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">People</h1>
      </div>

      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-2 text-center">
          <img
            src="media/images/harshPatel.jpeg"
            style={{ borderRadius: "80%", width: "50%" }}
          />
          <h4 className="mt-5">Harsh Patel</h4>
          <h6>Founder, CEO</h6>
        </div>
        <div className="col-6 p-3">
          <p>
            Harsh bootstrapped and founded Investo in 2025 to simplify investing
            for everyone after navigating the challenges of learning the markets
            firsthand. Today, Investo aims to empower a new generation of
            investors in India.
          </p>
          <p>
            He is passionate about financial literacy and is actively involved
            in shaping tools that make trading accessible and transparent.
          </p>
          <p>Coding, coffee, and a good market rally are his zen.</p>
          <p>
            Connect on <a href="">Homepage</a> / <a href="">Blog</a> /{" "}
            <a href="">Twitter</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
