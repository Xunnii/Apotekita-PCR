export default function Forgot() {
    return (
        <div>
            <h2 className="font-RalewayBold text-2xl font-semibold text-gray-700 mb-2 text-center">
                Lupa password kang???
            </h2>

            <p className="text-sm text-gray-500 mb-6 text-center">
                cak masukan email lu biar kasi verifnya
            </p>

            <form>
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="you@example.com"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primaryHover text-white font-semibold py-2 px-4
                        rounded-lg transition duration-300"
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    )
}
