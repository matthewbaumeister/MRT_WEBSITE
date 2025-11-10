--
-- PostgreSQL database dump
--

\restrict imtfMm5MneZ3wPvOo9nIXvJu7lbRw9W68nv9HBIvDcuRvLIyxkZQGaLBHAtPaJQ

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
-- Name: gsa_pricing_scraper_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gsa_pricing_scraper_log (
    id bigint NOT NULL,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    status text DEFAULT 'running'::text,
    total_price_lists integer DEFAULT 0,
    downloaded_count integer DEFAULT 0,
    parsed_count integer DEFAULT 0,
    failed_count integer DEFAULT 0,
    labor_categories_found integer DEFAULT 0,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE gsa_pricing_scraper_log; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.gsa_pricing_scraper_log IS 'Logs pricing scraper runs';


--
-- Name: gsa_pricing_scraper_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gsa_pricing_scraper_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gsa_pricing_scraper_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gsa_pricing_scraper_log_id_seq OWNED BY public.gsa_pricing_scraper_log.id;


--
-- Name: gsa_pricing_scraper_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gsa_pricing_scraper_log ALTER COLUMN id SET DEFAULT nextval('public.gsa_pricing_scraper_log_id_seq'::regclass);


--
-- Data for Name: gsa_pricing_scraper_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gsa_pricing_scraper_log (id, started_at, completed_at, status, total_price_lists, downloaded_count, parsed_count, failed_count, labor_categories_found, errors, created_at) FROM stdin;
1	2025-11-06 11:05:08.37679+00	2025-11-06 11:05:19.556792+00	completed	1968	10	0	0	0	\N	2025-11-06 16:05:08.407464+00
2	2025-11-06 11:16:22.700832+00	2025-11-06 11:47:08.683079+00	completed	1968	1958	0	0	0	\N	2025-11-06 16:16:22.728883+00
\.


--
-- Name: gsa_pricing_scraper_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gsa_pricing_scraper_log_id_seq', 2, true);


--
-- Name: gsa_pricing_scraper_log gsa_pricing_scraper_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gsa_pricing_scraper_log
    ADD CONSTRAINT gsa_pricing_scraper_log_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict imtfMm5MneZ3wPvOo9nIXvJu7lbRw9W68nv9HBIvDcuRvLIyxkZQGaLBHAtPaJQ

