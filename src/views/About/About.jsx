import React from "react";
import { Container } from "react-bootstrap";
import "./About.css";

function About() {
  const loadHeader = () => {
    return (
      <div>
        <div
          style={{
            backgroundImage: `url(assets/images/bg_breadcrumb.jpg)`,
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              padding: "100px",
            }}
          >
            About
            <div style={{ fontSize: "30px", direction: "ltr" }}>
              Who we are?
            </div>
          </div>
        </div>
      </div>
    );
  };
  const loadContent = () => {
    return (
      <div>
        <div>
          <div className="about-page-section-title">About us...</div>
          <div className="about-page-section-body">
            Our Website lists various digital content, e.g. downloadable game
            titles and other downloadable content. We sell on the Website
            official keys, issued by the publisher and/or the developer of
            relevant Content, which allow the user to unlock, access and
            download the relevant Content from the Developer’s platform. We are
            not the Developer of the Content and we do not own or operate the
            Developer’s platform. In addition to these Terms, you may also be
            subject to the Developer’s end user licence agreement and other
            terms related to its Content and its platform.
          </div>
        </div>
        <div>
          <div className="about-page-section-title">How to contact us?</div>
          <div className="about-page-section-body">
            You can contact us through the support or by writing to us at
            support@d-g.com. Israeli Company manages customer services and
            technical support queries on behalf of Instant Gaming.
          </div>
          <br />
        </div>
      </div>
    );
  };
  return (
    <Container
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        minHeight: "700px",
      }}
    >
      {[loadHeader(), loadContent()]}
    </Container>
  );
}
export default About;
