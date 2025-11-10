--
-- PostgreSQL database dump
--

\restrict WFDjhFCCkDbafvDRRFhF460r3sSdJvUGmIG8QyOfF8FfDRuY4QJ6lat3XC06NZm

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
-- Name: army_innovation_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.army_innovation_programs (
    id bigint NOT NULL,
    program_name text NOT NULL,
    program_full_name text,
    program_code text,
    program_type text,
    managing_entity text DEFAULT 'Army'::text,
    program_status text DEFAULT 'Active'::text,
    program_description text,
    program_mission text,
    focus_areas text[],
    target_participants text[],
    eligibility_requirements text,
    competition_structure text,
    typical_phases text[],
    typical_timeline_months integer,
    typical_prize_range_min numeric(12,2),
    typical_prize_range_max numeric(12,2),
    total_program_funding numeric(15,2),
    funding_source text,
    program_website text,
    registration_url text,
    contact_email text,
    social_media jsonb,
    total_competitions_held integer DEFAULT 0,
    total_participants integer DEFAULT 0,
    total_awards_made integer DEFAULT 0,
    total_funding_awarded numeric(15,2) DEFAULT 0,
    first_competition_date date,
    last_competition_date date,
    last_updated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: army_innovation_programs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.army_innovation_programs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: army_innovation_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.army_innovation_programs_id_seq OWNED BY public.army_innovation_programs.id;


--
-- Name: army_innovation_programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_programs ALTER COLUMN id SET DEFAULT nextval('public.army_innovation_programs_id_seq'::regclass);


--
-- Data for Name: army_innovation_programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.army_innovation_programs (id, program_name, program_full_name, program_code, program_type, managing_entity, program_status, program_description, program_mission, focus_areas, target_participants, eligibility_requirements, competition_structure, typical_phases, typical_timeline_months, typical_prize_range_min, typical_prize_range_max, total_program_funding, funding_source, program_website, registration_url, contact_email, social_media, total_competitions_held, total_participants, total_awards_made, total_funding_awarded, first_competition_date, last_competition_date, last_updated, created_at) FROM stdin;
1	XTECH	Army Expeditionary Technology Search	XTECH	competition	Army Futures Command	Active	The Army xTech Program connects small businesses with the Army to spur innovation and accelerate technology solutions that address Army challenges.	\N	{AI/ML,"Autonomous Systems","Advanced Materials",Biotechnology,Cyber,Electronics,Energy,"Position, Navigation, Timing"}	{small_business,startups,entrepreneurs,academia}	\N	\N	\N	\N	25000.00	250000.00	\N	\N	https://xtech.army.mil	\N	\N	\N	0	0	0	0.00	\N	\N	2025-11-04 17:00:32.37319+00	2025-11-04 17:00:32.37319+00
2	FUZE	Army FUZE Innovation Program	FUZE	innovation_pilot	Army	Active	Army FUZE serves as the Army's flagship innovation engine, accelerating the discovery, development, and deployment of emerging technologies.	\N	{"Autonomous Systems",AI/ML,"Sensor Technologies","Advanced Manufacturing"}	{small_business,startups,industry}	\N	\N	\N	\N	50000.00	500000.00	\N	\N	https://fuze.army.mil	\N	\N	\N	0	0	0	0.00	\N	\N	2025-11-04 17:00:32.37319+00	2025-11-04 17:00:32.37319+00
\.


--
-- Name: army_innovation_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.army_innovation_programs_id_seq', 2, true);


--
-- Name: army_innovation_programs army_innovation_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_programs
    ADD CONSTRAINT army_innovation_programs_pkey PRIMARY KEY (id);


--
-- Name: army_innovation_programs army_innovation_programs_program_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_programs
    ADD CONSTRAINT army_innovation_programs_program_name_key UNIQUE (program_name);


--
-- Name: idx_ainp_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ainp_name ON public.army_innovation_programs USING btree (program_name);


--
-- Name: idx_ainp_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ainp_status ON public.army_innovation_programs USING btree (program_status);


--
-- Name: idx_ainp_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ainp_type ON public.army_innovation_programs USING btree (program_type);


--
-- Name: army_innovation_programs update_army_innovation_programs_modtime; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_army_innovation_programs_modtime BEFORE UPDATE ON public.army_innovation_programs FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- PostgreSQL database dump complete
--

\unrestrict WFDjhFCCkDbafvDRRFhF460r3sSdJvUGmIG8QyOfF8FfDRuY4QJ6lat3XC06NZm

