--
-- PostgreSQL database dump
--

\restrict pvCe166Vqk5aaBUhHEYyQcWKxB6uTRLUdtjI6cUFTZANfaGbIzdCQAGLiMBc8vJ

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
-- Name: army_innovation_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.army_innovation_submissions (
    id bigint NOT NULL,
    opportunity_id bigint,
    company_name text,
    company_location text,
    company_state text,
    is_small_business boolean,
    socioeconomic_categories text[],
    submission_title text,
    technology_area text,
    submission_status text,
    phase text,
    award_amount numeric(12,2),
    award_date date,
    public_abstract text,
    submission_date date,
    created_at timestamp with time zone DEFAULT now(),
    company_intelligence_id bigint,
    intelligence_enriched boolean DEFAULT false
);


--
-- Name: army_innovation_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.army_innovation_submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: army_innovation_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.army_innovation_submissions_id_seq OWNED BY public.army_innovation_submissions.id;


--
-- Name: army_innovation_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_submissions ALTER COLUMN id SET DEFAULT nextval('public.army_innovation_submissions_id_seq'::regclass);


--
-- Data for Name: army_innovation_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.army_innovation_submissions (id, opportunity_id, company_name, company_location, company_state, is_small_business, socioeconomic_categories, submission_title, technology_area, submission_status, phase, award_amount, award_date, public_abstract, submission_date, created_at, company_intelligence_id, intelligence_enriched) FROM stdin;
3661	388	Envision Technology, LLC	Envision Technology, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:00:51.098388+00	\N	f
3662	388	OKSI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:00:51.098388+00	\N	f
3663	388	Photon-X Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:00:51.098388+00	\N	f
3664	389	Aegis Power Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3665	389	AmpX Technologies, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3666	389	Anthro Energy	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3667	389	Avilution	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3668	389	Barrow Green, LLC	Barrow Green, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3669	389	Carbon Limit Co.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3670	389	e-volve, inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3671	389	Enexor BioEnergy	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3672	389	Espiku	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3673	389	FC Renew, LLC	Renew, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3674	389	FluxWorks	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3675	389	Genesis Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3676	389	Inergy	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3677	389	Paragon Robotics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3678	389	Piersica	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3679	389	PowerFilm	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3680	389	R-DEX Systems, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3681	389	re: 3D Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3682	389	Resilient Energy and Infrastructure	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3683	389	Resilient Power Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3684	389	Resonant Link	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3685	389	Smart Material Solutions, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3686	389	Solar Roadways	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3687	389	Stealth Power	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3688	389	Accelerate Wind, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3689	389	Advanced Materials Manufacturing	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3690	389	Arbor Batteries LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3691	389	Dynaflow, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3692	389	Fairmount Technologies, LLC.	Fairmount Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3693	389	Flux XII	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3694	389	Forever Energy	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3695	389	Hawk Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3696	389	Imperia Batteries	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3697	389	LiBAMA_empowerST	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3698	389	LIFT Aircraft, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3699	389	Lithium Power, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3700	389	Mainstream Engineering	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3701	389	MolyWorks Materials Corp	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3702	389	MQ/AES	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3703	389	Management Sciences, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3704	389	Nanohmics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3705	389	Parasanti	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3706	389	Pathfinder Electronics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3707	389	Stat-EI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3708	389	SWR Technology, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3709	389	Team Zansors	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3710	389	TiaLinx, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3711	389	Transition45 Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3712	389	Tyfast	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3713	389	Ventum Biotech	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:09.334616+00	\N	f
3714	390	ANDRO Computational Solutions, LLC	Computational Solutions, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3715	390	Epiq Solutions	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3716	390	Perceptronics Solutions, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3717	390	R-DEX Systems, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3718	390	Skylark Wireless LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3719	390	Cirrus360	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3720	390	GreyCliff Industries, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3721	390	Intelligent Automation, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3722	390	Peachtree Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3723	390	TXMission LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:22.500425+00	\N	f
3724	391	Distributed Spectrum	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3725	391	Gates Defense Systems, LLC d/b/a GDX Development	Gates Defense Systems, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3726	391	Rhea Space Activity, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3727	391	Somewear Labs, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3728	391	WingXpand	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3729	391	GhostLink Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3730	391	I-Blades	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3731	391	I-nstein	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3732	391	IoTAI, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3733	391	SPS Aerial Remote Sensing, LLC	Aerial Remote Sensing, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3734	391	Stackpiercer Labs, LLC	Stackpiercer Labs, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3735	391	VR Rehab, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:38.867646+00	\N	f
3736	392	FN America, LLC	America, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:01:51.234845+00	\N	f
3737	393	8Seven8	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3738	393	Actile Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3739	393	Aeonix Energy, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3740	393	AirSight, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3741	393	Alitheon Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3742	393	Arinna, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3743	393	Aqua Research, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3744	393	Atlantic Sea Solutions, Inc. (Atlas)	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3745	393	Balcony Technology Group	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3746	393	Building Diagnostic Robotics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3747	393	Coreshell Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3748	393	Deepnight	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3749	393	Delta Chase LLXC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3750	393	DynamoFL, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3751	393	Ecovative	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3752	393	Elevate Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3753	393	FluxWorks, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3754	393	The Flying Ship Company	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3755	393	FrostByte Defense Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3756	393	Fulmer Instruments	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3757	393	Greensea IQ	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3758	393	Grid Raster Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3759	393	Hept Lab, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3760	393	HySonic Technologies LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3761	393	Icarus	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3762	393	Intrinsic Power, Inc.	Delivering Resilient, AI	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3763	393	Kent Optronics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3764	393	Khanjur R&D, LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3765	393	KLAW Industries LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3766	393	Knowmadics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3767	393	Little Arms Studios	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3768	393	Matregenix, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3769	393	Mesa Quantum Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3770	393	myLanguage, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3771	393	MyoKinetics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3772	393	Nano Nuclear Energy, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3773	393	NavaFlex, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3774	393	NCX Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3775	393	Notch Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3776	393	Oceans Edge	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3777	393	Olles Applied Research	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3778	393	Pliant Energy Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3779	393	PoE Texas	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3780	393	Portal Aircraft Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3781	393	QuantumSilicon Clocks LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3782	393	Reach Power Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3783	393	Resilient Energy & Infrastructure	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3784	393	Robust Intelligence	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3785	393	Saltenna Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3786	393	SCATR Corp	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3787	393	SciFi Innovations	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3788	393	Senseye, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3789	393	Sharper Sense, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3790	393	SolarMantle	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3791	393	Tactical Edge Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3792	393	TRACLabs, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3793	393	Tyfast Energy Corp	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3794	393	Verde Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3795	393	Wecoso, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3796	393	YERBA BUENA VR, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:15.813807+00	\N	f
3797	394	AeroParagon LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3798	394	Atolla Tech	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3799	394	Brelyon	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3800	394	Cleo Robotics Labs Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3801	394	Cool Amps Corp.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3802	394	Cornerstone Research Group, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3803	394	Elysium Robotics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3804	394	Enabled Engineering	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3805	394	Enig Associate, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3806	394	Genesis Codes Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3807	394	GSI Technology, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3808	394	Hydroplane Ltd.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3809	394	Nexcepta Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3810	394	Precision Combustion, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3811	394	Primordial Labs Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3812	394	Stealth Power	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3813	394	SunRay Scientific Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3814	394	Trusted Science and Technology	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3815	394	Farad Power	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3816	394	Yank Technologies, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3817	394	AEROMARINE CONSULTING, INC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3818	394	ALLVAR	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3819	394	Alpine Advanced Materials	Transformational Thermoplastic Nanocomposite, HX	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3820	394	Bevilacqua Research Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3821	394	Falcon Fuel Cells	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3822	394	Hawk Technologies, LLC	Hawk Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3823	394	dMetrics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3824	394	RISE Robotics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3825	394	Hinetics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3826	394	Homeostasis Systems Corp.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3827	394	Immobileyes Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3828	394	Infibertech, Corp.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3829	394	InfoBeyond Technology LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3830	394	Integrated Tactical Technologies, LLC	Integrated Tactical Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3831	394	Ion Storage Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3832	394	Kugar Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3833	394	METAseismic / Lawrence Berkeley National Laboratory	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3834	394	Mach Industries, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3835	394	Molten Industries Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3836	394	NAVSYS Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3837	394	NC Solar Inverters LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3838	394	PYRASTOP, INC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3839	394	Sixdof Space Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3840	394	Spark Connected	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3841	394	Stratin Engineering	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3842	394	Sufficiently Advanced, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3843	394	Trabus Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3844	394	Viele Exploratory Sustainable Solutions LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3845	394	XL Scientific, LLC., dba Verus Research	Scientific, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3846	394	Zinc Electric Power	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:36.128852+00	\N	f
3847	395	Anello Photonics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3848	395	Arbor Batteries LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3849	395	ForSight Technologies dba TeraDAR	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3850	395	Impressio Tech	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3851	395	Notch Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3852	395	Protonex LLC dba PNI Sensor	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3853	395	Soar Technology, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3854	395	Talus Ridge	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3855	395	Tyfast Energy Corp.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3856	395	WingXpand	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3857	395	Axiom Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3858	395	Carbon SiC Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3859	395	Dragoon Technology LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3860	395	Flyt Aerospace	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3861	395	Helicoid Industries Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3862	395	J3D Labs, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3863	395	Moleaer Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3864	395	NanTenna	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3865	395	Sempulse Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3866	395	Xona Space Systems Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:02:52.178491+00	\N	f
3867	396	IMSAR, LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3868	396	Legionarius, LLC	Legionarius, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3869	396	Macro-Eyes, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3870	396	QuSecure, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3871	396	RISE Robotics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3872	396	SixMap, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3873	396	Somewear Labs	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3874	396	Stealth Power	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3875	396	Storagenergy Technologies, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3876	396	Tomahawk Robotics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3877	396	BILT Incorporated	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3878	396	dMetrics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3879	396	Earthly Dynamics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3880	396	FLITE Materials Sciences	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3881	396	LongShot Space Technologies Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3882	396	Organic Robotics Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3883	396	Peachtree Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3884	396	Perceptronics Solutions	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3885	396	Solugen	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3886	396	Sphere Brake Defense LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:07.137794+00	\N	f
3887	397	Project OWL	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3888	397	ColdQuanta	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3889	397	Compound Eye	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3890	397	Genesis Systems LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3891	397	Nanohmics Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3892	397	Neurovation Labs, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3893	397	OXOS Medical	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3894	397	Pison	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3895	397	Remote Health Solutions	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3896	397	SiMa.ai	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:20.026507+00	\N	f
3897	398	Vita Inclinata Technologies	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3898	398	Bounce Imaging	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3899	398	Gene Capture, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3900	398	Inductive Ventures	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3901	398	IoT/AI, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3902	398	KeriCure, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3903	398	Lynq Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3904	398	MEI Micro, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3905	398	Multiscale Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:32.682028+00	\N	f
3906	399	TRX Systems, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3907	399	Anti-Rotational Technologies Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3908	399	Cayuga Biotech, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3909	399	ElectroNucleics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3910	399	GhostWave, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3911	399	Knight Technical Solutions, LLC	Knight Technical Solutions, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3912	399	LiquidPiston, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3913	399	Merciless Motors	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3914	399	SIGINT Systems, LLC	Systems, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3915	399	Syncopated Engineering, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3916	399	Tex Power, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3917	399	XOnano Smartfoam	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:45.334182+00	\N	f
3918	400	Lumineye, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3919	400	AKHAN Seminconductor, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3920	400	Cogitari, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3921	400	Great Lakes Sound and Vibration, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3922	400	Halomine, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3923	400	MELD Manufacturing Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3924	400	Olifant Medical	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3925	400	Spark Thermionics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3926	400	United Aircraft Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3927	400	Valley Tech Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3928	400	Vidrovr, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:03:57.862445+00	\N	f
3929	401	Adranos, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3930	401	Aeronics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3931	401	Blacksand Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3932	401	Cuberg, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3933	401	Hivemapper	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3934	401	Hyperdyne	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3935	401	NODAR, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3936	401	Notch Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3937	401	Sempulse, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3938	401	TangiTek, LLC	Tek, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3939	401	Wildspark Technologies, LLC	Wildspark Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3940	401	Wiser Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:10.082562+00	\N	f
3965	404	Asymmetric Technologies	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3966	404	Resonant Link	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3967	404	Stacato LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3968	404	SWR Technology Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3969	404	Compound Eye Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3970	404	ModalAI Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3971	404	NODAR, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3972	404	Owl Autonomous Imaging, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3973	404	Aloft Research Corporation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3974	404	Enview	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3975	404	Immersive Wisdom, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3976	404	Wind Talker Innovations	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3977	404	Higher Ground LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3978	404	Shared Spectrum Company	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3979	404	XL Scientific, LLC dba Verus Research	Scientific, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3980	404	Zylinium Research	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3981	404	Cornerstone Research Group, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3982	404	Megaray LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3983	404	Cybernet Systems Corporation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3984	404	Design Interactive, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3985	404	Preteckt Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3986	404	Trident Systems Incorporated	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:01.892282+00	\N	f
3941	402	Infleqtion	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:25.249067+00	\N	f
3942	402	Eduworks	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:25.249067+00	\N	f
3943	402	Ad hoc Research	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:25.249067+00	\N	f
3944	402	dMetrics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:25.249067+00	\N	f
3945	402	BlueRiSC, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:25.249067+00	\N	f
3946	402	Expression Networks, LLC	Expression Networks, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:25.249067+00	\N	f
3947	402	Latent AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:25.249067+00	\N	f
3948	402	Quartus Engineering	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:25.249067+00	\N	f
3949	403	Protopia AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3950	403	R-DEX Systems, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3951	403	Cenith Innovations LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3952	403	Credo AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3953	403	Dynamo AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3954	403	Latent AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3955	403	Next Tier Concepts Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3956	403	Phoenix Operations Group	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3957	403	Pytho AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3958	403	Senix Robotics LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3959	403	Striveworks	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3960	403	Trail of Bits	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3961	403	Anaconda, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3962	403	ColdQuanta Inc., dba Infleqtion	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3963	403	Valkyrie Intelligence	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3964	403	Walacor Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:04:45.901242+00	\N	f
3987	405	Amprius Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3988	405	Collins Aerospace	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3989	405	Perspecta Labs	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3990	405	Physical Sciences, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3991	405	Raytheon (TE Devices)	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3992	405	Scientific Systems Company, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3993	405	Toyon Research, Corp.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3994	405	BAE	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3995	405	CAMX Power	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3996	405	General Dynamics Mission Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3997	405	Phelps 2020	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3998	405	R-DEX Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
3999	405	Raytheon (Antenna)	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:20.611743+00	\N	f
4000	406	Alitheon, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4001	406	Amprius Technologies, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4002	406	ATOMICS, INC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4003	406	AxNano	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4004	406	DotBliss, LLC	Bliss, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4005	406	Enveil, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4006	406	FluxWorks LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4007	406	GDI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4008	406	Latent AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4009	406	Lunewave Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4010	406	Mesodyne	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4011	406	ModalAI, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4012	406	Neurable Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4013	406	Notch Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4014	406	TERADAR, INC.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4015	406	ANDRO Computational Solutions, LLC	Computational Solutions, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4016	406	Arbor Batteries	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4017	406	Beyond Silicon	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4018	406	FASTPORT, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4019	406	Helios Remote Sensing Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4020	406	InventWood LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4021	406	NuMoon Technologies, LLC	Moon Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4022	406	Sesame Solar Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4023	406	TurbineOne	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:38.768631+00	\N	f
4024	407	FieldLine Industries Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4025	407	Havoc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4026	407	Research Innovations Incorporated	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4027	407	ZeroMark, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4028	407	ANDRO Computational Solutions, LLC	Computational Solutions, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4029	407	ARTEMIS, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4030	407	Neurath LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4031	407	Nine Five North, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4032	407	Saronic Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4033	407	Syght, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4034	407	Worthington Products	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:05:53.086419+00	\N	f
4035	408	AIM Intelligent Machines	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4036	408	HI-Spectral, LLC	Spectral, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4037	408	Industria Imperium, LLC	Industria Imperium, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4038	408	Makai Ocean Engineering, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4039	408	Oceanit Laboratories Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4040	408	Pacific Impact Zone Solutions Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4041	408	PacMar Technologies	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4042	408	Wave Motion Launch Corporation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4043	408	Zepher Flight Laboratories, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4044	408	Echodyne Corp	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4045	408	Interstel Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4046	408	Nalu Scientific, LLC	Nalu Scientific, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4047	408	New Frontier Aerospace	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4048	408	Overland AI Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4049	408	Pertinacious Holdings LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4050	408	Premier Solutions Hi LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4051	408	Spectrum Photonics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4052	408	Zylinium Communications LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:09.026407+00	\N	f
4102	411	Icarus	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:59.056018+00	\N	f
4103	411	Bounce Imaging	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:59.056018+00	\N	f
4104	411	Latakoo	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:59.056018+00	\N	f
4105	411	LiveLink Aerospace	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:59.056018+00	\N	f
4106	411	Nantenna	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:59.056018+00	\N	f
4107	411	Reveal Technology	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:59.056018+00	\N	f
4053	409	Allen Control Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4054	409	AZAK, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4055	409	Cenith Innovations	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4056	409	Code19 Racing	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4057	409	Crow Industries	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4058	409	Ditto	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4059	409	Dragoon Technology LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4060	409	Empirical Systems Aerospace, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4061	409	eve Vehicles Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4062	409	Firestorm Labs Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4063	409	Forterra	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4064	409	GaardTech USA Ltd. Liability Co.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4065	409	Gambit Defense Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4066	409	Havoc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4067	409	IoTAI, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4068	409	Kodiak Robotics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4069	409	Lexset.ai, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4070	409	Lunar Resources, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4071	409	Mavrik Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4072	409	ModalAI, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4073	409	Modalic	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4074	409	NANTRAK TACTICAL, LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4075	409	Offroad Autonomy, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4076	409	Overland AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4077	409	Parry Labs, LLC	Parry Labs, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4078	409	Sandtable	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4079	409	Scientific Systems Company, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4080	409	Scout AI, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4081	409	Sherpa 6, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4082	409	Skyfront	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4083	409	Stridar, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4084	409	SURVICE ENGINEERING	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4085	409	Swarmbotics AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4086	409	Target Arm	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4087	409	Terminal Autonomy Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4088	409	Tern AI Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4089	409	Thor Dynamics Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4090	409	Titan Dynamics Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4091	409	Xdown INC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:06:29.757771+00	\N	f
4092	410	Allvar Alloys	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4093	410	Ozark Integrated Circuits, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4094	410	NecoTech	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4095	410	Anthro Energy, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4096	410	Ascend Manufacturing	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4097	410	Corsha	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4098	410	Craitor	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4099	410	Kupros, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4100	410	Multiscale Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4101	410	OPEX SYSTEMS LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:06:44.652366+00	\N	f
4108	412	HopLynk, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:14.304924+00	\N	f
4109	412	Perseus Defense	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:14.304924+00	\N	f
4110	412	Incerta Strategy Partners	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:14.304924+00	\N	f
4111	412	OpenInfer	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:14.304924+00	\N	f
4112	412	Pryzm	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:14.304924+00	\N	f
4113	412	PeopleTec, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:14.304924+00	\N	f
4114	413	AG3 LABS	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4115	413	AirBuoyant	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4116	413	American Tenet Incorporated	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4117	413	BANF Intelligent Tire System	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4118	413	dotLumen	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4119	413	Metarosetta	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4120	413	NEWNOP	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4121	413	Raptor Engineering Company	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4122	413	SoundPass Medical LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4123	413	Wave Therapeutics Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:27.833096+00	\N	f
4124	414	Magnus Metal	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4125	414	CERcuits BV	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4126	414	Equispheres	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4127	414	Fieldmade	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4128	414	Directed Metal 3D (Meltio used ad brand name)	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4129	414	K3RX s.r.l. (CNR-ISTEC spinoff)	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4130	414	Fraunhofer Institute for Chemical Technology CT	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4131	414	KU Leuven	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4132	414	National Research Council of Italy - Institute of Science, Technology and Sustainability for Ceramics (CNR - ISSMC)	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:41.463419+00	\N	f
4133	415	Deep Breathe	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4134	415	Miraex SA	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4135	415	AlumaPower Corporation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4136	415	Fieldmade	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4137	415	Archangel Imaging Ltd.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4138	415	Airis Labs	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4139	415	DEMCON Defense & Security Systems B.V.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4140	415	Ki3 Photonics Technologies Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4141	415	Quantum Canada PCM	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4142	415	SPEE3D	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4143	415	Seevix Material Science Ltd.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4144	415	University of Melbourne	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:07:57.706341+00	\N	f
4145	416	VEDA Ltd	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4146	416	Pass-ION Nano	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4147	416	Plasma Waters	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4148	416	SPACEDRIP	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4149	416	Biociencia	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4150	416	Aqua21	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4151	416	Drinkable	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4152	416	Emrod	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4153	416	Enersion Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4154	416	Genaq Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4155	416	HiPERSSYS	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4156	416	iQuan	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4157	416	Mogale Meat Company	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4158	416	Resonant Link	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:13.091118+00	\N	f
4159	417	aRoboticsCompany, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4160	417	Ascender Systems, Incorporated	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4161	417	Assured Information Security, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4162	417	AVER, LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4163	417	Borup Solutions LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4164	417	Deepnight	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4165	417	Franklin Engineering	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4166	417	Guidedwave (FBS, Inc.)	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4167	417	Guidepad	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4168	417	Innovo LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4169	417	Lunewave Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4170	417	Mainstream Engineering Corporation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4171	417	OFFSET3	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4172	417	Overland AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4173	417	Pryon, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4174	417	Pytho AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4175	417	Sherpa 6	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4176	417	SoloPulse	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4177	417	TeraDAR	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4178	417	Unstructured Technologies, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4179	417	US Clean Water Technology LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4180	417	Usul	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4181	417	Valid Evaluation, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4182	417	Voyant Photonics, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4183	417	Advanced Cooling Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4184	417	Aloft Sensing, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4185	417	Arch Systems, LLC	Arch Systems, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4186	417	Arize AI, Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4187	417	Aura Intelligent Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4188	417	BH Technology	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4189	417	Carnegie Robotics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4190	417	Charles River Analytics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4191	417	Cintel, Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4192	417	Clarifai, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4193	417	Clarifai, Inc. (Topic 6 Proposal)	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4194	417	Coda Solutions Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4195	417	Conductor AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4196	417	Data Squared USA Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4197	417	Davidson Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4198	417	Duality AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4199	417	Dynamo.AI LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4200	417	Elphel, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4201	417	Fiddler Labs Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4202	417	FieldLine Industries Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4203	417	Hazel AI Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4204	417	Lovelace AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4205	417	MCET Technologies LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4206	417	Machina Cognita Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4207	417	McLean Forrester LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4208	417	McQ Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4209	417	Nexagen Networks	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4210	417	NONA Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4211	417	Ombra LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4212	417	Precision ISR, LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4213	417	Rigor AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4214	417	Rune Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4215	417	Stottler Henke Associates	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4216	417	Stottler Henke Associates, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4217	417	TRI Austin	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4218	417	Tanner Research, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4219	417	The Attic AI, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4220	417	Vista Techwerx LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4221	417	Vivum Computing Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:39.124017+00	\N	f
4222	418	LatticeFlow	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4223	418	Cyber Defence Service Ltd	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4224	418	Amiral Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4225	418	Cognata Ltd	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4226	418	Cynalytica International Ltd	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4227	418	Finden	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4228	418	Mind Foundry Limited	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4229	418	Rowden Technologies Ltd	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4230	418	Spotlight Data	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:08:51.11084+00	\N	f
4231	420	Aloft Sensing, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4232	420	Grayscale AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4233	420	Syght, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4234	420	Applied Intuition Team	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4235	420	Embneusys PC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4236	420	Lunewave	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4237	420	Mission Solutions Group	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4238	420	Nalu Technology	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4239	420	Terapico LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4240	420	Toyon Antenna and RF Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4241	420	Trex Enterprise Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4242	420	University of California Santa Cruz	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:09:19.761724+00	\N	f
4243	421	L3 Harris.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:32.493304+00	\N	f
4244	421	Mercury Mission Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:32.493304+00	\N	f
4245	421	Pacific Defense	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:32.493304+00	\N	f
4246	422	Vanderbilt University	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:44.357603+00	\N	f
4247	422	Drexel University	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:44.357603+00	\N	f
4248	422	SPARK Neuro	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:44.357603+00	\N	f
4249	422	University of California at Berkeley	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:44.357603+00	\N	f
4250	422	SkillPower	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:44.357603+00	\N	f
4271	424	Annapolis Micro Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:11.286923+00	\N	f
4272	424	Curtiss-Wright-Corporation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:11.286923+00	\N	f
4273	424	Herrick Technologies Lab	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:11.286923+00	\N	f
4274	424	Orolia Defense & Security	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:11.286923+00	\N	f
4275	424	Spectranetix	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:11.286923+00	\N	f
4276	425	Galley Power LLC/UEC Electronics LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:25.71357+00	\N	f
4277	425	Storagenergy Technologies	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:25.71357+00	\N	f
4278	425	GLX Power Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:25.71357+00	\N	f
4279	425	Southwest Research Institute	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:25.71357+00	\N	f
4280	425	Ateios	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:25.71357+00	\N	f
4281	425	UC Berkeley	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:25.71357+00	\N	f
4282	426	Gowan Rowland	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:37.668554+00	\N	f
4283	426	Amy Swanson and Jaidon Lybbert	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:37.668554+00	\N	f
4284	426	Chase Yakaboski	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:37.668554+00	\N	f
4305	428	FPH USA	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:11:07.79996+00	\N	f
4306	428	TexPower, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:11:07.79996+00	\N	f
4307	428	Black Diamond Structures	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:11:07.79996+00	\N	f
4308	428	LiquidPiston	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:11:07.79996+00	\N	f
4309	428	Mafic USA	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:11:07.79996+00	\N	f
4310	428	Spark Thermonics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:11:07.79996+00	\N	f
4311	428	UHV Technology, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:11:07.79996+00	\N	f
4251	423	Scientific Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4252	423	Elroy Air, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4253	423	Primordial Labs Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4254	423	SunRay Scientific Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4255	423	STEER Tech LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4256	423	Protonex LLC dba PNI Sensor	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4257	423	TeleSwivel LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4258	423	WingXpand	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4259	423	Dragoon Technology LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4260	423	Xwing, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4261	423	krtkl Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4262	423	Forward Edge AI, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4263	423	Photon Semantics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4264	423	Mesodyne	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4265	423	Vyir Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4266	423	Poseidon System, LLC	Poseidon System, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4267	423	Charles River Analytics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4268	423	Censys Technologies	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4269	423	Tracks North America	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4270	423	MaXentric Technologies LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:09:59.414233+00	\N	f
4285	427	Ozni AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4286	427	PeopleTec	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4287	427	Snorkel AI, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4288	427	Latent AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4289	427	Exia Labs	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4290	427	R-DEX Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4291	427	Ad hoc Research	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4292	427	Anote	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4293	427	AURA Technologies, LLC	Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4294	427	dMetrics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4295	427	EdgeRunner AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4296	427	Haevek Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4297	427	Kestrel Intelligence, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4298	427	Mountain Biometrics Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4299	427	Pienomial Inc	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4300	427	Precise Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4301	427	Protopia AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4302	427	Strategic AI Services, LLC	Services, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4303	427	T2S Solutions	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4304	427	Vaultree, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:10:55.768024+00	\N	f
4312	429	AirMid Critical Care Products	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:11:19.062018+00	\N	f
4313	429	SISU	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:11:19.062018+00	\N	f
4314	429	Spiro Devices, LLC	Spiro Devices, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:11:19.062018+00	\N	f
4315	429	Woodward, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:11:19.062018+00	\N	f
4316	429	World Ventilator Foundation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:11:19.062018+00	\N	f
4317	388	Envision Technology, LLC	Envision Technology, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:43:31.416681+00	\N	f
4318	388	OKSI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:43:31.416681+00	\N	f
4319	388	Photon-X Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:43:31.416681+00	\N	f
4320	388	Envision Technology, LLC	Envision Technology, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:44:48.334159+00	\N	f
4321	388	OKSI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:44:48.334159+00	\N	f
4322	388	Photon-X Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:44:48.334159+00	\N	f
4323	388	Envision Technology, LLC	Envision Technology, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:49:44.608058+00	\N	f
4324	388	OKSI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:49:44.608058+00	\N	f
4325	388	Photon-X Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:49:44.608058+00	\N	f
4326	389	Aegis Power Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4327	389	AmpX Technologies, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4328	389	Anthro Energy	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4329	389	Avilution	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4330	389	Barrow Green, LLC	Barrow Green, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4331	389	Carbon Limit Co.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4332	389	e-volve, inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4333	389	Enexor BioEnergy	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4334	389	Espiku	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4335	389	FC Renew, LLC	Renew, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4336	389	FluxWorks	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4337	389	Genesis Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4338	389	Inergy	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4339	389	Paragon Robotics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4340	389	Piersica	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4341	389	PowerFilm	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4342	389	R-DEX Systems, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4343	389	re: 3D Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4344	389	Resilient Energy and Infrastructure	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4345	389	Resilient Power Systems	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4346	389	Resonant Link	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4347	389	Smart Material Solutions, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4348	389	Solar Roadways	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4349	389	Stealth Power	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4350	389	Accelerate Wind, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4351	389	Advanced Materials Manufacturing	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4352	389	Arbor Batteries LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4353	389	Dynaflow, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4354	389	Fairmount Technologies, LLC.	Fairmount Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4355	389	Flux XII	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4356	389	Forever Energy	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4357	389	Hawk Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4358	389	Imperia Batteries	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4359	389	LiBAMA_empowerST	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4360	389	LIFT Aircraft, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4361	389	Lithium Power, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4362	389	Mainstream Engineering	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4363	389	MolyWorks Materials Corp	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4364	389	MQ/AES	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4365	389	Management Sciences, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4366	389	Nanohmics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4367	389	Parasanti	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4368	389	Pathfinder Electronics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4369	389	Stat-EI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4370	389	SWR Technology, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4371	389	Team Zansors	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4372	389	TiaLinx, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4373	389	Transition45 Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4374	389	Tyfast	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4375	389	Ventum Biotech	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:00.862729+00	\N	f
4376	390	ANDRO Computational Solutions, LLC	Computational Solutions, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4377	390	Epiq Solutions	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4378	390	Perceptronics Solutions, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4379	390	R-DEX Systems, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4380	390	Skylark Wireless LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4381	390	Cirrus360	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4382	390	GreyCliff Industries, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4383	390	Intelligent Automation, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4384	390	Peachtree Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4385	390	TXMission LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:12.699225+00	\N	f
4386	391	Distributed Spectrum	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4387	391	Gates Defense Systems, LLC d/b/a GDX Development	Gates Defense Systems, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4388	391	Rhea Space Activity, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4389	391	Somewear Labs, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4390	391	WingXpand	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4391	391	GhostLink Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4392	391	I-Blades	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4393	391	I-nstein	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4394	391	IoTAI, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4395	391	SPS Aerial Remote Sensing, LLC	Aerial Remote Sensing, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4396	391	Stackpiercer Labs, LLC	Stackpiercer Labs, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4397	391	VR Rehab, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:25.603362+00	\N	f
4398	392	FN America, LLC	America, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:36.31718+00	\N	f
4399	393	8Seven8	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4400	393	Actile Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4401	393	Aeonix Energy, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4402	393	AirSight, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4403	393	Alitheon Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4404	393	Arinna, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4405	393	Aqua Research, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4406	393	Atlantic Sea Solutions, Inc. (Atlas)	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4407	393	Balcony Technology Group	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4408	393	Building Diagnostic Robotics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4409	393	Coreshell Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4410	393	Deepnight	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4411	393	Delta Chase LLXC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4412	393	DynamoFL, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4413	393	Ecovative	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4414	393	Elevate Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4415	393	FluxWorks, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4416	393	The Flying Ship Company	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4417	393	FrostByte Defense Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4418	393	Fulmer Instruments	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4419	393	Greensea IQ	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4420	393	Grid Raster Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4421	393	Hept Lab, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4422	393	HySonic Technologies LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4423	393	Icarus	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4424	393	Intrinsic Power, Inc.	Delivering Resilient, AI	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4425	393	Kent Optronics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4426	393	Khanjur R&D, LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4427	393	KLAW Industries LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4428	393	Knowmadics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4429	393	Little Arms Studios	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4430	393	Matregenix, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4431	393	Mesa Quantum Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4432	393	myLanguage, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4433	393	MyoKinetics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4434	393	Nano Nuclear Energy, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4435	393	NavaFlex, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4436	393	NCX Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4437	393	Notch Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4438	393	Oceans Edge	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4439	393	Olles Applied Research	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4440	393	Pliant Energy Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4441	393	PoE Texas	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4442	393	Portal Aircraft Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4443	393	QuantumSilicon Clocks LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4444	393	Reach Power Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4445	393	Resilient Energy & Infrastructure	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4446	393	Robust Intelligence	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4447	393	Saltenna Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4448	393	SCATR Corp	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4449	393	SciFi Innovations	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4450	393	Senseye, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4451	393	Sharper Sense, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4452	393	SolarMantle	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4453	393	Tactical Edge Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4454	393	TRACLabs, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4455	393	Tyfast Energy Corp	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4456	393	Verde Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4457	393	Wecoso, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4458	393	YERBA BUENA VR, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:53:56.78137+00	\N	f
4459	394	AeroParagon LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4460	394	Atolla Tech	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4461	394	Brelyon	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4462	394	Cleo Robotics Labs Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4463	394	Cool Amps Corp.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4464	394	Cornerstone Research Group, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4465	394	Elysium Robotics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4466	394	Enabled Engineering	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4467	394	Enig Associate, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4468	394	Genesis Codes Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4469	394	GSI Technology, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4470	394	Hydroplane Ltd.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4471	394	Nexcepta Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4472	394	Precision Combustion, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4473	394	Primordial Labs Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4474	394	Stealth Power	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4475	394	SunRay Scientific Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4476	394	Trusted Science and Technology	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4477	394	Farad Power	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4478	394	Yank Technologies, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4479	394	AEROMARINE CONSULTING, INC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4480	394	ALLVAR	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4481	394	Alpine Advanced Materials	Transformational Thermoplastic Nanocomposite, HX	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4482	394	Bevilacqua Research Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4483	394	Falcon Fuel Cells	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4484	394	Hawk Technologies, LLC	Hawk Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4485	394	dMetrics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4486	394	RISE Robotics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4487	394	Hinetics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4488	394	Homeostasis Systems Corp.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4489	394	Immobileyes Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4490	394	Infibertech, Corp.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4491	394	InfoBeyond Technology LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4492	394	Integrated Tactical Technologies, LLC	Integrated Tactical Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4493	394	Ion Storage Systems	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4494	394	Kugar Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4495	394	METAseismic / Lawrence Berkeley National Laboratory	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4496	394	Mach Industries, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4497	394	Molten Industries Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4498	394	NAVSYS Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4499	394	NC Solar Inverters LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4500	394	PYRASTOP, INC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4501	394	Sixdof Space Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4502	394	Spark Connected	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4503	394	Stratin Engineering	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4504	394	Sufficiently Advanced, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4505	394	Trabus Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4506	394	Viele Exploratory Sustainable Solutions LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4507	394	XL Scientific, LLC., dba Verus Research	Scientific, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4508	394	Zinc Electric Power	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:14.712446+00	\N	f
4509	395	Anello Photonics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4510	395	Arbor Batteries LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4511	395	ForSight Technologies dba TeraDAR	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4512	395	Impressio Tech	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4513	395	Notch Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4514	395	Protonex LLC dba PNI Sensor	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4515	395	Soar Technology, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4516	395	Talus Ridge	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4517	395	Tyfast Energy Corp.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4518	395	WingXpand	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4519	395	Axiom Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4520	395	Carbon SiC Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4521	395	Dragoon Technology LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4522	395	Flyt Aerospace	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4523	395	Helicoid Industries Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4524	395	J3D Labs, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4525	395	Moleaer Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4526	395	NanTenna	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4527	395	Sempulse Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4528	395	Xona Space Systems Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:28.419301+00	\N	f
4529	396	IMSAR, LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4530	396	Legionarius, LLC	Legionarius, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4531	396	Macro-Eyes, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4532	396	QuSecure, Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4533	396	RISE Robotics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4534	396	SixMap, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4535	396	Somewear Labs	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4536	396	Stealth Power	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4537	396	Storagenergy Technologies, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4538	396	Tomahawk Robotics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4539	396	BILT Incorporated	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4540	396	dMetrics	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4541	396	Earthly Dynamics LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4542	396	FLITE Materials Sciences	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4543	396	LongShot Space Technologies Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4544	396	Organic Robotics Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4545	396	Peachtree Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4546	396	Perceptronics Solutions	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4547	396	Solugen	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4548	396	Sphere Brake Defense LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:41.364767+00	\N	f
4559	398	Vita Inclinata Technologies	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4560	398	Bounce Imaging	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4561	398	Gene Capture, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4562	398	Inductive Ventures	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4563	398	IoT/AI, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4564	398	KeriCure, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4565	398	Lynq Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4566	398	MEI Micro, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4567	398	Multiscale Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:04.580569+00	\N	f
4549	397	Project OWL	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4550	397	ColdQuanta	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4551	397	Compound Eye	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4552	397	Genesis Systems LLC	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4553	397	Nanohmics Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4554	397	Neurovation Labs, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4555	397	OXOS Medical	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4556	397	Pison	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4557	397	Remote Health Solutions	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4558	397	SiMa.ai	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:54:52.904419+00	\N	f
4568	399	TRX Systems, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4569	399	Anti-Rotational Technologies Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4570	399	Cayuga Biotech, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4571	399	ElectroNucleics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4572	399	GhostWave, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4573	399	Knight Technical Solutions, LLC	Knight Technical Solutions, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4574	399	LiquidPiston, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4575	399	Merciless Motors	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4576	399	SIGINT Systems, LLC	Systems, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4577	399	Syncopated Engineering, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4578	399	Tex Power, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4579	399	XOnano Smartfoam	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:16.680417+00	\N	f
4580	400	Lumineye, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4581	400	AKHAN Seminconductor, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4582	400	Cogitari, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4583	400	Great Lakes Sound and Vibration, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4584	400	Halomine, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4585	400	MELD Manufacturing Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4586	400	Olifant Medical	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4587	400	Spark Thermionics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4588	400	United Aircraft Technologies, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4589	400	Valley Tech Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4590	400	Vidrovr, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:28.411061+00	\N	f
4591	401	Adranos, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4592	401	Aeronics, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4593	401	Blacksand Technologies	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4594	401	Cuberg, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4595	401	Hivemapper	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4596	401	Hyperdyne	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4597	401	NODAR, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4598	401	Notch Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4599	401	Sempulse, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4600	401	TangiTek, LLC	Tek, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4601	401	Wildspark Technologies, LLC	Wildspark Technologies, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4602	401	Wiser Systems, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:39.687724+00	\N	f
4603	402	Infleqtion	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:55:52.029902+00	\N	f
4604	402	Eduworks	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:55:52.029902+00	\N	f
4605	402	Ad hoc Research	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:55:52.029902+00	\N	f
4606	402	dMetrics	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:55:52.029902+00	\N	f
4607	402	BlueRiSC, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:52.029902+00	\N	f
4608	402	Expression Networks, LLC	Expression Networks, LL	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:52.029902+00	\N	f
4609	402	Latent AI	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:52.029902+00	\N	f
4610	402	Quartus Engineering	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:55:52.029902+00	\N	f
4611	403	Protopia AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4612	403	R-DEX Systems, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4613	403	Cenith Innovations LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4614	403	Credo AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4615	403	Dynamo AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4616	403	Latent AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4617	403	Next Tier Concepts Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4618	403	Phoenix Operations Group	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4619	403	Pytho AI	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4620	403	Senix Robotics LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4621	403	Striveworks	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4622	403	Trail of Bits	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4623	403	Anaconda, Inc.	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4624	403	ColdQuanta Inc., dba Infleqtion	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4625	403	Valkyrie Intelligence	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4626	403	Walacor Corporation	\N	\N	\N	\N	\N	\N	Finalist	\N	\N	\N	\N	\N	2025-11-04 22:56:08.232057+00	\N	f
4627	404	Asymmetric Technologies	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4628	404	Resonant Link	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4629	404	Stacato LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4630	404	SWR Technology Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4631	404	Compound Eye Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4632	404	ModalAI Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4633	404	NODAR, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4634	404	Owl Autonomous Imaging, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4635	404	Aloft Research Corporation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4636	404	Enview	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4637	404	Immersive Wisdom, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4638	404	Wind Talker Innovations	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4639	404	Higher Ground LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4640	404	Shared Spectrum Company	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4641	404	XL Scientific, LLC dba Verus Research	Scientific, LL	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4642	404	Zylinium Research	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4643	404	Cornerstone Research Group, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4644	404	Megaray LLC	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4645	404	Cybernet Systems Corporation	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4646	404	Design Interactive, Inc.	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4647	404	Preteckt Inc	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
4648	404	Trident Systems Incorporated	\N	\N	\N	\N	\N	\N	Winner	\N	\N	\N	\N	\N	2025-11-04 22:56:22.753869+00	\N	f
\.


--
-- Name: army_innovation_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.army_innovation_submissions_id_seq', 4648, true);


--
-- Name: army_innovation_submissions army_innovation_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_submissions
    ADD CONSTRAINT army_innovation_submissions_pkey PRIMARY KEY (id);


--
-- Name: idx_ains_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ains_company ON public.army_innovation_submissions USING btree (company_name);


--
-- Name: idx_ains_opportunity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ains_opportunity ON public.army_innovation_submissions USING btree (opportunity_id);


--
-- Name: idx_ains_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ains_status ON public.army_innovation_submissions USING btree (submission_status);


--
-- Name: idx_army_sub_intel_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_army_sub_intel_id ON public.army_innovation_submissions USING btree (company_intelligence_id);


--
-- Name: army_innovation_submissions army_innovation_submissions_company_intelligence_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_submissions
    ADD CONSTRAINT army_innovation_submissions_company_intelligence_id_fkey FOREIGN KEY (company_intelligence_id) REFERENCES public.company_intelligence(id);


--
-- Name: army_innovation_submissions army_innovation_submissions_opportunity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.army_innovation_submissions
    ADD CONSTRAINT army_innovation_submissions_opportunity_id_fkey FOREIGN KEY (opportunity_id) REFERENCES public.army_innovation_opportunities(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict pvCe166Vqk5aaBUhHEYyQcWKxB6uTRLUdtjI6cUFTZANfaGbIzdCQAGLiMBc8vJ

