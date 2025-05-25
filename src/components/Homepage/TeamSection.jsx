function TeamCard({ name, role, desc }) {
    return (
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-gray-500 mb-2">{role}</p>
            <p className="text-sm text-gray-600">{desc}</p>
        </div>
    );
}

export default function TeamSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
                <TeamCard
                    name="Jose Rodriguez"
                    role="CEO"
                    desc="Lorem Ipsum is that it has a more-or-less normal distribution..."
                />
                <TeamCard
                    name="Et Harumseter"
                    role="CTO"
                    desc="Lorem Ipsum has been the industry’s standard dummy text..."
                />
            </div>
        </section>
    );
}
