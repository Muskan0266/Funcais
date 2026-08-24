import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full p-2 h-8 md:h-15 bg-black flex items-center justify-center gap-x-4 md:gap-x-6">
            <div className="flex gap-x-4 font-sans text-gray-300 text-lg">
                <Link to="/">
                    <p>Home</p>
                </Link>

                <Link to="/contact">
                    <p>Contact</p>
                </Link>

                <Link to="/about">
                    <p>About</p>
                </Link>
            </div>

            <div className="flex gap-x-3 ml-6">
                <a
                    href="https://www.instagram.com/_muskan.2626?igsh=MWR1NjlvMnFjbHd0dA=="
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/018/930/415/non_2x/instagram-logo-instagram-icon-transparent-free-png.png"
                        alt="Instagram"
                        className="h-8 w-8 cursor-pointer"
                    />
                </a>

                <a
                    href="https://www.linkedin.com/in/muskan-bhagwashiya-144564331"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png"
                        alt="LinkedIn"
                        className="h-8 w-8 cursor-pointer"
                    />
                </a>

                <a
                    href="mailto:25muskaaan@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://images.icon-icons.com/2642/PNG/512/google_mail_gmail_logo_icon_159346.png"
                        alt="Gmail"
                        className="h-8 w-8 cursor-pointer"
                    />
                </a>
            </div>
        </footer>
    );
};

export default Footer;