--
-- PostgreSQL database dump
--

\restrict gneReAvtHcamoUWwgyMhAOtFklHptcU8Q9ysGbYMpvf9LonBEoU2qFj4E85g3I0

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
-- Name: army_innovation_scraper_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.army_innovation_scraper_log (
    id bigint NOT NULL,
    scrape_type text NOT NULL,
    scrape_target text,
    records_found integer DEFAULT 0,
    records_inserted integer DEFAULT 0,
    records_updated integer DEFAULT 0,
    records_errors integer DEFAULT 0,
    status text NOT NULL,
    error_message text,
    error_details text,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    duration_seconds integer
);


--
-- Name: army_innovation_scraper_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.army_innovation_scraper_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: army_innovation_scraper_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.army_innovation_scraper_log_id_seq OWNED BY public.army_innovation_scraper_log.id;


--
-- Name: army_innovation_scraper_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_scraper_log ALTER COLUMN id SET DEFAULT nextval('public.army_innovation_scraper_log_id_seq'::regclass);


--
-- Data for Name: army_innovation_scraper_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.army_innovation_scraper_log (id, scrape_type, scrape_target, records_found, records_inserted, records_updated, records_errors, status, error_message, error_details, started_at, completed_at, duration_seconds) FROM stdin;
1	xtech	historical	44	44	0	0	completed	\N	\N	2025-11-04 17:00:38.9+00	2025-11-04 17:12:40.05+00	\N
3	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 17:21:06.852+00	\N	\N
2	xtech	historical	44	44	0	0	completed	\N	\N	2025-11-04 17:15:52.14+00	2025-11-04 17:27:57.777+00	\N
4	xtech	historical	44	44	0	0	completed	\N	\N	2025-11-04 17:30:24.88+00	2025-11-04 17:42:17.644+00	\N
5	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 17:47:37.091+00	\N	\N
6	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 17:57:04.946+00	\N	\N
7	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 18:00:19.734+00	\N	\N
8	xtech	historical	44	44	0	0	completed	\N	\N	2025-11-04 18:05:22.596+00	2025-11-04 18:17:23.258+00	\N
9	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 18:30:22.568+00	\N	\N
10	xtech	historical	44	44	0	0	completed	\N	\N	2025-11-04 18:39:33.754+00	2025-11-04 18:51:27.871+00	\N
11	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 21:00:14.716+00	\N	\N
12	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 21:07:23.351+00	\N	\N
13	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 21:15:36.22+00	\N	\N
14	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 21:23:39.481+00	\N	\N
15	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 21:30:03.988+00	\N	\N
16	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 21:34:40.18+00	\N	\N
17	xtech	historical	0	0	0	0	started	\N	\N	2025-11-04 21:45:13.126+00	\N	\N
18	xtech	historical	44	44	0	0	completed	\N	\N	2025-11-04 21:59:23.573+00	2025-11-04 22:11:19.065+00	\N
19	xtech	active	0	0	0	0	failed	Could not find Chrome (ver. 142.0.7444.59). This can occur if either\n 1. you did not perform an installation before running the script (e.g. `npx puppeteer browsers install chrome`) or\n 2. your cache path is incorrectly configured (which is: /home/sbx_user1051/.cache/puppeteer).\nFor (2), check out our guide on configuring puppeteer at https://pptr.dev/guides/configuration.	\N	2025-11-04 22:22:52.603+00	2025-11-04 22:22:52.798+00	\N
20	xtech	active	3	3	0	0	completed	\N	\N	2025-11-04 22:42:11.844+00	2025-11-04 22:43:31.457+00	\N
21	xtech	active	3	3	0	0	completed	\N	\N	2025-11-04 22:43:31.91+00	2025-11-04 22:44:48.384+00	\N
22	xtech	active	3	3	0	0	completed	\N	\N	2025-11-04 22:48:24.55+00	2025-11-04 22:49:44.623+00	\N
23	xtech	active	0	0	0	0	started	\N	\N	2025-11-04 22:51:24.453+00	\N	\N
24	xtech	active	0	0	0	0	started	\N	\N	2025-11-04 22:55:59.14+00	\N	\N
25	xtech	active	0	0	0	0	started	\N	\N	2025-11-04 22:59:36.515+00	\N	\N
26	xtech	active	0	0	0	0	started	\N	\N	2025-11-04 23:02:42.751+00	\N	\N
27	xtech	active	3	3	0	0	completed	\N	\N	2025-11-04 23:11:01.805+00	2025-11-04 23:12:21.717+00	\N
28	xtech	active	3	3	0	0	completed	\N	\N	2025-11-05 13:00:31.553+00	2025-11-05 13:01:51.248+00	\N
29	xtech	active	3	3	0	0	completed	\N	\N	2025-11-05 13:29:56.916+00	2025-11-05 13:31:18.826+00	\N
30	xtech	active	3	3	0	0	completed	\N	\N	2025-11-05 14:10:12.051+00	2025-11-05 14:11:35.119+00	\N
31	xtech	active	3	3	0	0	completed	\N	\N	2025-11-06 13:00:06.415+00	2025-11-06 13:01:30.234+00	\N
\.


--
-- Name: army_innovation_scraper_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.army_innovation_scraper_log_id_seq', 31, true);


--
-- Name: army_innovation_scraper_log army_innovation_scraper_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_scraper_log
    ADD CONSTRAINT army_innovation_scraper_log_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict gneReAvtHcamoUWwgyMhAOtFklHptcU8Q9ysGbYMpvf9LonBEoU2qFj4E85g3I0

