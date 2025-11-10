--
-- PostgreSQL database dump
--

\restrict Pz8QiILmkM4iYCrlPoHUsILihOnobNgWuUe4YMUzoeK2ktCtCzYIldqAlUi9h9B

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
-- Name: mantech_scraper_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantech_scraper_log (
    id bigint NOT NULL,
    scrape_type text NOT NULL,
    scrape_date date NOT NULL,
    component text,
    status text NOT NULL,
    articles_found integer DEFAULT 0,
    articles_scraped integer DEFAULT 0,
    articles_failed integer DEFAULT 0,
    projects_created integer DEFAULT 0,
    projects_updated integer DEFAULT 0,
    companies_extracted integer DEFAULT 0,
    error_message text,
    error_details jsonb,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    duration_seconds integer,
    triggered_by text,
    user_email text
);


--
-- Name: mantech_scraper_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mantech_scraper_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mantech_scraper_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mantech_scraper_log_id_seq OWNED BY public.mantech_scraper_log.id;


--
-- Name: mantech_scraper_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantech_scraper_log ALTER COLUMN id SET DEFAULT nextval('public.mantech_scraper_log_id_seq'::regclass);


--
-- Data for Name: mantech_scraper_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantech_scraper_log (id, scrape_type, scrape_date, component, status, articles_found, articles_scraped, articles_failed, projects_created, projects_updated, companies_extracted, error_message, error_details, started_at, completed_at, duration_seconds, triggered_by, user_email) FROM stdin;
1	news	2025-11-05	News	completed	0	0	0	0	0	343	\N	\N	2025-11-05 17:30:15.315+00	2025-11-05 17:30:17.479+00	2	cron	\N
\.


--
-- Name: mantech_scraper_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantech_scraper_log_id_seq', 1, true);


--
-- Name: mantech_scraper_log mantech_scraper_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantech_scraper_log
    ADD CONSTRAINT mantech_scraper_log_pkey PRIMARY KEY (id);


--
-- Name: mantech_scraper_log mantech_scraper_log_scrape_date_scrape_type_component_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantech_scraper_log
    ADD CONSTRAINT mantech_scraper_log_scrape_date_scrape_type_component_key UNIQUE (scrape_date, scrape_type, component);


--
-- Name: idx_mantech_log_component; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantech_log_component ON public.mantech_scraper_log USING btree (component);


--
-- Name: idx_mantech_log_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantech_log_date ON public.mantech_scraper_log USING btree (scrape_date DESC);


--
-- Name: idx_mantech_log_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantech_log_status ON public.mantech_scraper_log USING btree (status);


--
-- PostgreSQL database dump complete
--

\unrestrict Pz8QiILmkM4iYCrlPoHUsILihOnobNgWuUe4YMUzoeK2ktCtCzYIldqAlUi9h9B

