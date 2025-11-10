--
-- PostgreSQL database dump
--

\restrict ndbUl56O7pqMMCTcjDSwkZHsKYBUzmLk65TxomCZYwx8KSIIofVtP9DTwagdYrR

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: army_innovation_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.army_innovation_documents (
    id bigint NOT NULL,
    opportunity_id bigint,
    document_type text NOT NULL,
    document_title text NOT NULL,
    document_description text,
    file_url text NOT NULL,
    file_type text,
    file_size_mb numeric(8,2),
    document_text text,
    document_summary text,
    version text,
    published_date date,
    last_updated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: army_innovation_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.army_innovation_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: army_innovation_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.army_innovation_documents_id_seq OWNED BY public.army_innovation_documents.id;


--
-- Name: army_innovation_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_documents ALTER COLUMN id SET DEFAULT nextval('public.army_innovation_documents_id_seq'::regclass);


--
-- Data for Name: army_innovation_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.army_innovation_documents (id, opportunity_id, document_type, document_title, document_description, file_url, file_type, file_size_mb, document_text, document_summary, version, published_date, last_updated, created_at) FROM stdin;
\.


--
-- Name: army_innovation_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.army_innovation_documents_id_seq', 1, false);


--
-- Name: army_innovation_documents army_innovation_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_documents
    ADD CONSTRAINT army_innovation_documents_pkey PRIMARY KEY (id);


--
-- Name: idx_aind_opportunity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_aind_opportunity ON public.army_innovation_documents USING btree (opportunity_id);


--
-- Name: idx_aind_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_aind_type ON public.army_innovation_documents USING btree (document_type);


--
-- Name: army_innovation_documents army_innovation_documents_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_documents
    ADD CONSTRAINT army_innovation_documents_opportunity_id_fkey FOREIGN KEY (opportunity_id) REFERENCES public.army_innovation_opportunities(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ndbUl56O7pqMMCTcjDSwkZHsKYBUzmLk65TxomCZYwx8KSIIofVtP9DTwagdYrR

