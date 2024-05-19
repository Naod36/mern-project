import React from "react";

export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About CCFS</h1>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-lg leading-relaxed">
          At the Court Case Filing System (CCFS), our mission is to simplify the
          legal process for individuals and legal professionals by providing a
          streamlined, efficient, and secure online platform for submitting
          court case information. We aim to enhance accessibility to the legal
          system, reduce paperwork, and expedite the scheduling of court dates.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">What We Do</h2>
        <p className="text-lg leading-relaxed">
          CCFS offers an innovative solution for filing court cases online. Our
          platform allows users to:
        </p>
        <ul className="list-disc list-inside pl-4 text-lg leading-relaxed">
          <li>
            Submit Case Information: Easily fill out and submit detailed
            information about your case through our intuitive online forms.
          </li>
          <li>
            Upload Supporting Documents: Securely upload necessary documents
            such as identification, evidence, and other pertinent files.
          </li>
          <li>
            Receive Court Dates: Get notified promptly about your assigned court
            dates after submission, reducing the waiting time and improving case
            management.
          </li>
          <li>
            Track Case Progress: Stay updated with the status of your case,
            ensuring transparency and timely updates.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Why Choose CCFS?</h2>
        <p className="text-lg leading-relaxed">
          - User-Friendly Interface: Our platform is designed to be simple and
          accessible, making it easy for anyone to use, regardless of technical
          expertise.
          <br />
          - Security and Privacy: We prioritize the security of your data. All
          submissions and documents are encrypted and stored securely, ensuring
          confidentiality.
          <br />
          - Efficiency: By reducing the need for physical paperwork and
          in-person visits, we save you time and streamline the filing process.
          <br />- Accessibility: Our online system is available 24/7, allowing
          you to submit your case information at your convenience from anywhere.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
        <p className="text-lg leading-relaxed">
          We are here to help you with any questions or concerns you may have.
          If you need assistance or more information about our services, please
          feel free to reach out to our support team.
        </p>
        <p className="text-lg leading-relaxed">
          <strong>Email:</strong> support@ccfs.com
          <br />
          <strong>Phone:</strong> +251 900 000-000
          <br />
          <strong>Address:</strong> Harar - Ethiopia
        </p>
      </section>

      <p className="text-lg leading-relaxed">
        Thank you for choosing CCFS. We are dedicated to providing you with the
        best possible service and making the court case filing process as
        seamless as possible.
      </p>
    </div>
  );
}
