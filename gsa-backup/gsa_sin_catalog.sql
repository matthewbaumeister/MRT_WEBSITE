--
-- PostgreSQL database dump
--

\restrict cC7JdScKDXNVUiVVHKWhSElbLDF67SXq4bV7EOclF4X73bnlsk5aeVLeDdPTqF7

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
-- Name: gsa_sin_catalog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gsa_sin_catalog (
    id bigint NOT NULL,
    sin_code text NOT NULL,
    sin_name text NOT NULL,
    sin_description text,
    schedule_number text,
    category text,
    subcategory text,
    is_active boolean DEFAULT true,
    effective_date date,
    expiration_date date,
    total_contractors integer DEFAULT 0,
    last_contractor_count_update timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: gsa_sin_catalog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gsa_sin_catalog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gsa_sin_catalog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gsa_sin_catalog_id_seq OWNED BY public.gsa_sin_catalog.id;


--
-- Name: gsa_sin_catalog id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gsa_sin_catalog ALTER COLUMN id SET DEFAULT nextval('public.gsa_sin_catalog_id_seq'::regclass);


--
-- Data for Name: gsa_sin_catalog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gsa_sin_catalog (id, sin_code, sin_name, sin_description, schedule_number, category, subcategory, is_active, effective_date, expiration_date, total_contractors, last_contractor_count_update, created_at, updated_at) FROM stdin;
\.


--
-- Name: gsa_sin_catalog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gsa_sin_catalog_id_seq', 1, false);


--
-- Name: gsa_sin_catalog gsa_sin_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gsa_sin_catalog
    ADD CONSTRAINT gsa_sin_catalog_pkey PRIMARY KEY (id);


--
-- Name: gsa_sin_catalog gsa_sin_catalog_sin_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gsa_sin_catalog
    ADD CONSTRAINT gsa_sin_catalog_sin_code_key UNIQUE (sin_code);


--
-- Name: idx_sin_catalog_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sin_catalog_active ON public.gsa_sin_catalog USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_sin_catalog_schedule; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sin_catalog_schedule ON public.gsa_sin_catalog USING btree (schedule_number);


--
-- Name: idx_sin_catalog_sin_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sin_catalog_sin_code ON public.gsa_sin_catalog USING btree (sin_code);


--
-- Name: gsa_sin_catalog update_gsa_sin_catalog_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_gsa_sin_catalog_updated_at BEFORE UPDATE ON public.gsa_sin_catalog FOR EACH ROW EXECUTE FUNCTION public.update_gsa_gwac_updated_at();


--
-- PostgreSQL database dump complete
--

\unrestrict cC7JdScKDXNVUiVVHKWhSElbLDF67SXq4bV7EOclF4X73bnlsk5aeVLeDdPTqF7

