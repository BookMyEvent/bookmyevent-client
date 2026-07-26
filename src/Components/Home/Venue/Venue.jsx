import React from 'react';
import './venue.css';

const CLOUDINARY = {
  mph: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054572/venue/pm2tohaozdtlquudawtm.jpg",
  libraryFunctionHall: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054574/venue/rudhpjmrrzfhzeovkabk.jpg",
  librarySeminarHall1: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054578/venue/ctszxnbb1r31n08scibx.jpg",
  librarySeminarHall2: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054582/venue/tzheps5z2bhyhjrcer2e.jpg",
  librarySeminarHall3: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054585/venue/p3wnxomqv8ool0crjvmx.jpg",
  bioTech1: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054588/venue/k4fclszedluac2ncvyio.jpg",
  bioTech2: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054592/venue/yy0lmu6ho6m7cuwvtdfk.jpg",
  bioTech3: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054596/venue/gkro9djrbd0k1jcjgmrz.jpg",
  conferenceHall1: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054598/venue/dclqbu0z8x1wurkykulf.jpg",
  conferenceHall2: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054599/venue/uo7gbjiik2k1allcmnuw.jpg",
  conferenceHall3: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054601/venue/rjjvymqhwgav3haehyjj.jpg",
  conferenceHall4: "https://res.cloudinary.com/drlcxzy2i/image/upload/v1785054602/venue/iu1ijtlrql7ui2fi3cx5.jpg",
};

function Venue() {
  return (
    <div className='venue'>
      <h2 className="venue-main-title">Venues</h2>
      {/* Multi Purpose Hall */}
      <div className="card card-venue">
        <div className='venue-content'>
          <h4 className='venue-title'>MULTI PURPOSE HALL</h4>
          <p className='venue-desc'>A multi-purpose hall is a versatile space designed to accommodate various activities and events. These halls are typically large and flexible, capable of hosting a wide range of functions
            such as conferences, seminars, workshops, exhibitions, cultural events, sports activities, and more. They often feature adjustable seating arrangements, audiovisual equipment, stage setups, and other amenities to
            cater to different event requirements.Whether it's a lecture, concert, sports event, or even a social gathering, a multi-purpose hall provides a central location that can accommodate diverse activities.
          </p>
          <h5 className='venue-title'>Seating Capacity - 1500</h5>
          <h4 className='venue-title'>Resources Available</h4>
          <ul className='specs'>
            <li className='points'>LCD PROJECTOR - SCREEN SIZE 10" x 12"</li>
            <li className='points'>800 WATT SPEAKER - 4 nos</li>
            <li className='points'>250 WATT SPEAKER - 4 nos</li>
            <li className='points'>WIRELESS MIC</li>
            <li className='points'>PODIUM WITH MIC - 2nos</li>
            <li className='points'>SOUND SYSTEM</li>
          </ul>
        </div>
        <div className="venue-img">
          <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="https://lh3.googleusercontent.com/p/AF1QipPW16MIs48OHB-7-5FuIMlx6lawJbyjDIzsnl-g=s1360-w1360-h1020" class="d-block w-100" alt="MPH" />
              </div>
              <div class="carousel-item">
                <img src="https://lh3.googleusercontent.com/p/AF1QipNwpNID44wqvsyvliv2dUWoHjairwDIFoyBlizp=s1360-w1360-h1020" class="d-block w-100" alt="MPH" />
              </div>
              <div class="carousel-item">
                <img src={CLOUDINARY.mph} class="d-block w-100" alt="MPH" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Library Function Hall */}
      <div className="card card-venue">
        <div className='venue-content'>
          <h4 className='venue-title'>LIBRARY FUNCTION HALL</h4>
          <p className='venue-desc'>
            The Library Function Hall is a dedicated space within an institution designed for presentations, other activities like hackathon and so on.
            Library Function Hall serves as a valuable resource for various purposes, including:
            <b className='venue-title'> Academic Instruction,Presentations and Seminars,Webinars and Online Learning.</b>
          </p>
          <h5 className='venue-title'>Seating Capacity - 240</h5>
          <h4 className='venue-title'>Resources Available</h4>
          <ul className='specs'>
            <li className='points'>LCD PROJECTOR - SCREEN SIZE 8" x 6"</li>
            <li className='points'>WIRELESS MIC</li>
            <li className='points'>PODIUM WITH MIC</li>
            <li className='points'>COLLAR MIC</li>
            <li className='points'>SOUND SYSTEM</li>
            <li className='points'>AIR CONDITIONER</li>
            <li className='points'>LAPTOP</li>
          </ul>
        </div>
        <div className="venue-img">
          <div id="carouselExampleIndicators1" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src={CLOUDINARY.libraryFunctionHall} class="d-block w-100" alt="Library Function Hall" />
              </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators1" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators1" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>

          </div>
        </div>
      </div>



      {/* Library Seminar Hall */}
      <div className="card card-venue">
        <div className='venue-content'>
          <h4 className='venue-title'>LIBRARY SEMINAR HALL</h4>
          <p className='venue-desc'>
            A library seminar hall is typically a dedicated space within the library that serves as a venue for conducting seminars, workshops, presentations, and other academic activities. It provides a suitable environment for intellectual discussions, knowledge sharing, and interactive sessions.
            The seating arrangements are designed to ensure the comfort of the participants during seminars and other events.
            Adequate lighting and acoustics are important considerations to create a conducive environment for learning and engagement.
          </p>
          <h5 className='venue-title'>Seating Capacity - 80</h5>
          <h4 className='venue-title'>Resources Available</h4>
          <ul className='specs'>
            <li className='points'>LCD PROJECTOR - SCREEN SIZE 8" x 6"</li>
            <li className='points'>55" TELEVISION</li>
            <li className='points'>WIRELESS MIC</li>
            <li className='points'>PODIUM WITH MIC</li>
            <li className='points'>COLLAR MIC</li>
            <li className='points'>SOUND SYSTEM</li>
            <li className='points'>AIR CONDITIONER</li>
            <li className='points'>LAPTOP</li>
          </ul>
        </div>

        <div className="venue-img">
          <div id="carouselExampleIndicators3" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src={CLOUDINARY.librarySeminarHall1} class="d-block w-100" alt="Library Seminar Hall" />
              </div>
              <div class="carousel-item">
                <img src={CLOUDINARY.librarySeminarHall2} class="d-block w-100" alt="Library Seminar Hall" />
              </div>
              <div class="carousel-item">
                <img src={CLOUDINARY.librarySeminarHall3} class="d-block w-100" alt="Library Seminar Hall" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators3" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators3" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bio Tech Seminr Hall */}
      <div className="card card-venue">
        <div className='venue-content'>
          <h4 className='venue-title'>BIO TECH SEMINAR HALL</h4>
          <p className='venue-desc'>
            A Bio Tech seminar hall is typically a dedicated space within the BioTechnology Department that serves as a venue for conducting seminars, workshops, presentations, and other academic activities.
            It provides a suitable environment for intellectual discussions, knowledge sharing, and interactive sessions.
            The seating arrangements are designed to ensure the comfort of the participants during seminars and other events.
          </p>
          <h5 className='venue-title'>Seating Capacity - 80</h5>
          <h4 className='venue-title'>Resources Available</h4>
          <ul className='specs'>
            <li className='points'>LCD PROJECTOR - SCREEN SIZE 8" x 6"</li>
            <li className='points'>PODIUM WITH MIC</li>
            <li className='points'>CORDLESS MIC</li>
            <li className='points'>SOUND SYSTEM</li>
            <li className='points'>AIR CONDITIONER</li>
            <li className='points'>LASER POINTER</li>
            <li className='points'>PUBLIC ADDRESSING SYSTEM</li>
            <li className='points'>BANNER SIZE - 6" X 4" / 8" X 6"</li>
          </ul>
        </div>

        <div className="venue-img">
          <div id="carouselExampleIndicators4" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src={CLOUDINARY.bioTech1} class="d-block w-100" alt="Bio Tech Seminar Hall" />
              </div>
              <div class="carousel-item">
                <img src={CLOUDINARY.bioTech2} class="d-block w-100" alt="Bio Tech Seminar Hall" />
              </div>
              <div class="carousel-item">
                <img src={CLOUDINARY.bioTech3} class="d-block w-100" alt="Bio Tech Seminar Hall" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators4" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators4" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conference Hall */}
      <div className="card card-venue">
        <div className='venue-content'>
          <h4 className='venue-title'>LIBRARY CONFERENCE HALL</h4>
          <p className='venue-desc'>
            A Library Conference Hall is typically a dedicated space within the library that serves as a venue for conducting seminars, workshops, presentations, and other academic activities. It provides a suitable environment for intellectual discussions, knowledge sharing, and interactive sessions.
            The seating arrangements are designed to ensure the comfort of the participants during seminars and other events.
            Adequate lighting and acoustics are important considerations to create a conducive environment for learning and engagement.
          </p>
          <h5 className='venue-title'>Seating Capacity - 25</h5>
          <h4 className='venue-title'>Resources Available</h4>
          <ul className='specs'>
            <li className='points'>LCD PROJECTOR - SCREEN SIZE 8" x 6"</li>
            <li className='points'>HAND MIC</li>
            <li className='points'>COLLAR MIC</li>
            <li className='points'>SOUND SYSTEM</li>
            <li className='points'>AIR CONDITIONER</li>
            <li className='points'>LAPTOP</li>
            <li className='points'>WIFI</li>
            <li className='points'>INTERACTIVE PANEL - 65 inch</li>
            <li className='points'>AUDIO SYSTEM</li>
          </ul>
        </div>

        <div className="venue-img">
          <div id="carouselExampleIndicators5" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src={CLOUDINARY.conferenceHall1} class="d-block w-100" alt="Conference Hall" />
              </div>
              <div class="carousel-item">
                <img src={CLOUDINARY.conferenceHall2} class="d-block w-100" alt="Conference Hall" />
              </div>
              <div class="carousel-item">
                <img src={CLOUDINARY.conferenceHall3} class="d-block w-100" alt="Conference Hall" />
              </div>
              <div class="carousel-item">
                <img src={CLOUDINARY.conferenceHall4} class="d-block w-100" alt="Conference Hall" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators5" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators5" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Venue