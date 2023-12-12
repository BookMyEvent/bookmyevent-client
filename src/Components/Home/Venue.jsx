import React from 'react';
import BioTech1 from "../../Assets/Bio Tech Seminar Hall (1).jpg"
import BioTech2 from "../../Assets/Bio Tech Seminar Hall (2).jpg"
import BioTech3 from "../../Assets/Bio Tech Seminar Hall (3).jpg"
import LibraryHall1 from "../../Assets/Library Seminar Hall (1).jpg"
import LibraryHall2 from "../../Assets/Library Seminar Hall (2).jpg"
import LibraryHall3 from "../../Assets/Library Seminar Hall (3).jpg"
import mph from "../../Assets/MPH.jpeg";
import FunctionHall from "../../Assets/Function Hall.jpeg";
import FunctionHall2 from "../../Assets/Function Hall(1).jpg";
import FunctionHall3 from "../../Assets/Function Hall(2).jpg";
import VideoHall from "../../Assets/Video Hall.jpg";
import VideoHall1 from "../../Assets/Video Hall (2).jpg";
import ConferenceHall1 from '../../Assets/Conference Hall (1).jpeg';
import ConferenceHall2 from '../../Assets/Conference Hall (2).jpeg';
import ConferenceHall3 from '../../Assets/Conference Hall (3).jpeg';
import ConferenceHall4 from '../../Assets/Conference Hall (4).jpeg';


import './venue.css';

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
                <img src="https://lh3.googleusercontent.com/p/AF1QipPW16MIs48OHB-7-5FuIMlx6lawJbyjDIzsnl-g=s1360-w1360-h1020" class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src="https://lh3.googleusercontent.com/p/AF1QipNwpNID44wqvsyvliv2dUWoHjairwDIFoyBlizp=s1360-w1360-h1020" class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={mph} class="d-block w-100" alt="..." />
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

      {/* Function Hall */}
      <div className="card card-venue">
        <div className='venue-content'>
          <h4 className='venue-title'>FUNCTION HALL</h4>
          <p className='venue-desc'>
            The Function hall is a dedicated space within an institution designed for presentations, other activities like hackathon and so on.
            Function hall serves as a valuable resource for various purposes, including:
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
                <img src={FunctionHall} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={FunctionHall2} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={FunctionHall3} class="d-block w-100" alt="..." />
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

      {/* Video Hall */}
      <div className="card card-venue">
        <div className='venue-content'>
          <h4 className='venue-title'>VIDEO HALL</h4>
          <p className='venue-desc'>
            The Video hall is a dedicated space within an institution designed for presentations, other activities like hackathon and so on.
            Video hall serves as a valuable resource for various purposes, including:
            <b className='venue-title'> Academic Instruction,Presentations and Seminars,Webinars and Online Learning.</b>
          </p>
          <h5 className='venue-title'>Seating Capacity - 120</h5>
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
          <div id="carouselExampleIndicators2" class="carousel slide" data-bs-ride="true">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src={VideoHall} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={VideoHall1} class="d-block w-100" alt="..." />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators2" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators2" data-bs-slide="next">
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
                <img src={LibraryHall1} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={LibraryHall2} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={LibraryHall3} class="d-block w-100" alt="..." />
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
                <img src={BioTech1} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={BioTech2} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={BioTech3} class="d-block w-100" alt="..." />
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
                <img src={ConferenceHall1} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={ConferenceHall2} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={ConferenceHall3} class="d-block w-100" alt="..." />
              </div>
              <div class="carousel-item">
                <img src={ConferenceHall4} class="d-block w-100" alt="..." />
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