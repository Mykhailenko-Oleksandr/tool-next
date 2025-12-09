"use client";

import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createNote } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { NoteFormData } from "@/types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";

const OrderSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  function onClose() {
    router.back();
  }

  const createNoteMutate = useMutation({
    mutationFn: (data: NoteFormData) => createNote(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      onClose();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  async function handleSubmit(formData: FormData) {
    const valueCreatedForm: NoteFormData = {
      title: (formData.get("title") as string) || "",
      content: (formData.get("content") as string) || "",
      tag:
        (formData.get("tag") as
          | "Todo"
          | "Work"
          | "Personal"
          | "Meeting"
          | "Shopping") || "Todo",
    };

    try {
      await OrderSchema.validate(valueCreatedForm, { abortEarly: false });
      createNoteMutate.mutate(valueCreatedForm);
    } catch (error: unknown) {
      if (error instanceof Yup.ValidationError) {
        toast.error(error.errors.join(", "));
      }
    }
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form
      action={handleSubmit}
      className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft?.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft?.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft?.tag}
          onChange={handleChange}
          required>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          onClick={onClose}
          type="button"
          className={css.cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={false}>
          Create note
        </button>
      </div>
    </form>
  );
}
