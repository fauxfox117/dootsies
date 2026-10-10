"use client";

import Modal from "@/components/Modal/Modal";

import "./HiringAnnouncement.css";

const FRONT_OF_HOUSE = [
  "Management",
  "Hosts",
  "Servers",
  "Server Assistants",
  "Bartenders",
  "Barbacks",
  "Food Runners",
];

const BACK_OF_HOUSE = [
  "Sous Chefs",
  "Line Cooks",
  "Prep Cooks",
  "Porters / Dish",
];

const HiringAnnouncement = ({ isOpen, onClose }) => {
  return (
    <Modal name="hiring" isOpen={isOpen} onClose={onClose}>
      <div className="hiring-announcement">
        <p className="mono">We're Hiring</p>
        <h2>Open Call</h2>
        <p className="hiring-announcement-subheading">
          Be Part of Our Opening Team
        </p>

        <div className="hiring-announcement-details">
          <p className="mono">Thursday, October 22</p>
          <p className="mono">12 PM – 3 PM</p>
        </div>

        <div className="hiring-announcement-location">
          <p className="mono">Hosted at Scoundrel</p>
          <p className="sm">18 N. Main St, Greenville, SC</p>
        </div>

        <div className="hiring-announcement-roles">
          <div className="hiring-announcement-roles-col">
            <p className="mono">Front of House</p>
            <ul>
              {FRONT_OF_HOUSE.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
          <div className="hiring-announcement-roles-col">
            <p className="mono">Back of House</p>
            <ul>
              {BACK_OF_HOUSE.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="hiring-announcement-footer">
          From the team behind Scoundrel
        </p>
      </div>
    </Modal>
  );
};

export default HiringAnnouncement;
