--
-- PostgreSQL database dump
--

\restrict wcPWcvo7msqGgzosPACQyXLc6rPjfNYZJLiTazwbCkH0Bq0SEOA7VJHKSNDOguy

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
-- Name: defense_contractors_tickers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.defense_contractors_tickers (
    id bigint NOT NULL,
    ticker character varying(20) NOT NULL,
    company_name character varying(255) NOT NULL,
    is_prime_contractor boolean DEFAULT true,
    sector character varying(100),
    added_at timestamp without time zone DEFAULT now()
);


--
-- Name: defense_contractors_tickers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.defense_contractors_tickers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: defense_contractors_tickers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.defense_contractors_tickers_id_seq OWNED BY public.defense_contractors_tickers.id;


--
-- Name: defense_contractors_tickers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defense_contractors_tickers ALTER COLUMN id SET DEFAULT nextval('public.defense_contractors_tickers_id_seq'::regclass);


--
-- Data for Name: defense_contractors_tickers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.defense_contractors_tickers (id, ticker, company_name, is_prime_contractor, sector, added_at) FROM stdin;
1	LMT	Lockheed Martin	t	Aerospace & Defense	2025-11-05 15:03:24.620542
2	RTX	Raytheon Technologies	t	Aerospace & Defense	2025-11-05 15:03:24.620542
3	BA	Boeing	t	Aerospace & Defense	2025-11-05 15:03:24.620542
4	NOC	Northrop Grumman	t	Aerospace & Defense	2025-11-05 15:03:24.620542
5	GD	General Dynamics	t	Aerospace & Defense	2025-11-05 15:03:24.620542
6	LHX	L3Harris Technologies	t	Aerospace & Defense	2025-11-05 15:03:24.620542
7	HII	Huntington Ingalls Industries	t	Shipbuilding	2025-11-05 15:03:24.620542
8	TXT	Textron	t	Aerospace & Defense	2025-11-05 15:03:24.620542
9	LDOS	Leidos Holdings	t	IT Services & Defense	2025-11-05 15:03:24.620542
10	SAIC	Science Applications International	t	IT Services & Defense	2025-11-05 15:03:24.620542
11	CACI	CACI International	t	IT Services & Defense	2025-11-05 15:03:24.620542
12	KTOS	Kratos Defense & Security	t	Defense Technology	2025-11-05 15:03:24.620542
13	PLTR	Palantir Technologies	t	Defense Software	2025-11-05 15:03:24.620542
14	ASTS	AST SpaceMobile	f	Space Technology	2025-11-05 15:03:24.620542
15	RKLB	Rocket Lab	f	Space Launch	2025-11-05 15:03:24.620542
16	SPCE	Virgin Galactic	f	Space Tourism	2025-11-05 15:03:24.620542
17	MSFT	Microsoft	f	Cloud & Defense IT	2025-11-05 15:03:24.620542
18	AMZN	Amazon	f	Cloud & Defense IT	2025-11-05 15:03:24.620542
19	GOOGL	Alphabet/Google	f	Cloud & Defense IT	2025-11-05 15:03:24.620542
20	ORCL	Oracle	f	Cloud & Defense IT	2025-11-05 15:03:24.620542
\.


--
-- Name: defense_contractors_tickers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.defense_contractors_tickers_id_seq', 20, true);


--
-- Name: defense_contractors_tickers defense_contractors_tickers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defense_contractors_tickers
    ADD CONSTRAINT defense_contractors_tickers_pkey PRIMARY KEY (id);


--
-- Name: defense_contractors_tickers defense_contractors_tickers_ticker_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defense_contractors_tickers
    ADD CONSTRAINT defense_contractors_tickers_ticker_key UNIQUE (ticker);


--
-- PostgreSQL database dump complete
--

\unrestrict wcPWcvo7msqGgzosPACQyXLc6rPjfNYZJLiTazwbCkH0Bq0SEOA7VJHKSNDOguy

