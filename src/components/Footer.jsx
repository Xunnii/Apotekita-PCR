export default function Footer() {
    return (
        <footer className="bg-pudar1 text-white text-sm py-8 md:py-10">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="font-bold mb-2">Navigate</h3>
                    <ul className="space-y-1">
                        <li>Three Key Points</li>
                        <li>Get in Touch</li>
                        <li>Social Proof</li>
                        <li>Our Team</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Contact</h3>
                    <p>Office: 1020 Central Ave Ste 10, Cheyenne, WY 82001</p>
                    <p>Tel: +1-226-640-7623</p>
                    <p>Email: service@microedlab.com</p>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Subscribe</h3>
                    <p className="mb-2">The latest news, updates, and resources</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="flex-1 px-2 py-1 rounded text-black min-w-0"
                        />
                        <button className="bg-orange-300 text-white px-4 py-1 rounded hover:bg-orange-600 w-full sm:w-auto">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-8 px-2">
                Copyright © Lorem Ipsum. All rights reserved.
            </p>
        </footer>
    );
}
