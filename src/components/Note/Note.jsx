import React, { useState, useEffect } from "react";
import { notesAPI } from "../services/notesAPI";
import AlertBox from "../components/Note/AlertBox";
import GenericTable from "../components/Note/GenericTable";
import { AiFillDelete } from "react-icons/ai";

export default function Notes() {
    const [dataForm, setDataForm] = useState({
        title: "", content: "", status: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [notes, setNotes] = useState([]);

    // Handle perubahan nilai input form
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    // Memanggil fetchNotes beserta error/loading handling
    const loadNotes = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await notesAPI.fetchNotes();
            setNotes(data);
        } catch (err) {
            setError("Gagal memuat catatan");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Load data saat pertama di-render
    useEffect(() => {
        loadNotes();
    }, []);

    // Handle form submission for creating notes
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await notesAPI.createNote(dataForm);

            setSuccess("Catatan berhasil ditambahkan!");
            setDataForm({ title: "", content: "", status: "" });
            setTimeout(() => setSuccess(""), 3000);
            loadNotes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete note
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus catatan ini?")) return;
        try {
            setLoading(true);
            setError("");
            await notesAPI.deleteNote(id);
            setSuccess("Catatan berhasil dihapus!");
            setTimeout(() => setSuccess(""), 3000);
            loadNotes();
        } catch (err) {
            setError("Gagal menghapus catatan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Notes App
                </h2>
            </div>
            {/* Alert */}
            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Tambah Catatan Baru
                </h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={dataForm.title}
                        placeholder="Judul catatan"
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none
                            focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all
                            duration-200"
                        disabled={loading}
                    />
                    <textarea
                        name="content"
                        value={dataForm.content}
                        placeholder="Isi catatan"
                        onChange={handleChange}
                        required
                        rows="2"
                        className="w-full p-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none
                            focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all
                            duration-200 resize-none"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
                            rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500
                            focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-200 shadow-lg"
                        disabled={loading}
                    >
                        {loading ? "Mohon Tunggu..." : "Tambah Data"}
                    </button>
                </form>
            </div>
            {/* Notes Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-10">
                <div className="px-6 py-4 ">
                    <h3 className="text-lg font-semibold">
                        Daftar Catatan ({notes.length})
                    </h3>
                </div>
                <GenericTable
                    columns={["#", "Judul", "Isi Catatan", "Aksi"]}
                    data={notes}
                    renderRow={(note, index) => (
                        <>
                            <td className="px-6 py-4 font-medium text-gray-700">
                                {index + 1}.
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-semibold text-emerald-600">
                                    {note.title}
                                </div>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                                <div className="truncate text-gray-600">
                                    {note.content}
                                </div>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                                <div className="truncate text-gray-600">
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        disabled={loading}
                                    >
                                        <AiFillDelete className="text-red-400 text-2xl hover:text-red-600 transition-colors" />
                                    </button>
                                </div>
                            </td>
                        </>
                    )}
                />
            </div>
        </div>
    );
} 
