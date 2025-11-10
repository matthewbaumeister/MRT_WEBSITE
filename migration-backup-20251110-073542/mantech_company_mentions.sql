--
-- PostgreSQL database dump
--

\restrict K0Fceyamprd279bijMyZjV28YIqQ0vOz1uq87tmXt1fP8G4E2IXeVrVAKrr5R2U

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
-- Name: mantech_company_mentions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mantech_company_mentions (
    id bigint NOT NULL,
    project_id bigint,
    company_name text NOT NULL,
    mention_type text,
    role_description text,
    location text,
    company_normalized text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: mantech_company_mentions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mantech_company_mentions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mantech_company_mentions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mantech_company_mentions_id_seq OWNED BY public.mantech_company_mentions.id;


--
-- Name: mantech_company_mentions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantech_company_mentions ALTER COLUMN id SET DEFAULT nextval('public.mantech_company_mentions_id_seq'::regclass);


--
-- Data for Name: mantech_company_mentions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mantech_company_mentions (id, project_id, company_name, mention_type, role_description, location, company_normalized, created_at) FROM stdin;
971	326	ManTech	prime	\N	\N	mantech	2025-11-05 17:02:04.330612+00
972	326	ManTech	partner	\N	\N	mantech	2025-11-05 17:02:04.330612+00
973	328	ManTech	prime	\N	\N	mantech	2025-11-05 17:02:10.937467+00
974	328	ManTech	partner	\N	\N	mantech	2025-11-05 17:02:10.937467+00
975	329	ManTech	prime	\N	\N	mantech	2025-11-05 17:02:14.084076+00
976	329	ManTech	partner	\N	\N	mantech	2025-11-05 17:02:14.084076+00
977	330	Indiana Economic Development Corporation	prime	\N	\N	indiana economic development corporation	2025-11-05 17:02:17.194007+00
978	330	Indiana Economic Development Corporation	partner	\N	\N	indiana economic development corporation	2025-11-05 17:02:17.194007+00
979	330	ManTech	partner	\N	\N	mantech	2025-11-05 17:02:17.194007+00
980	331	ManTech	prime	\N	\N	mantech	2025-11-05 17:02:20.312838+00
981	331	ManTech	partner	\N	\N	mantech	2025-11-05 17:02:20.312838+00
982	332	ManTech	prime	\N	\N	mantech	2025-11-05 17:02:23.403292+00
983	332	ManTech	partner	\N	\N	mantech	2025-11-05 17:02:23.403292+00
984	333	Spirit AeroSystems	prime	\N	\N	spirit aerosystems	2025-11-05 17:02:26.479803+00
985	333	Spirit AeroSystems	partner	\N	\N	spirit aerosystems	2025-11-05 17:02:26.479803+00
986	333	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:02:26.479803+00
987	336	Boeing	prime	\N	\N	boeing	2025-11-05 17:02:35.240557+00
988	336	Boeing	partner	\N	\N	boeing	2025-11-05 17:02:35.240557+00
989	337	ManTech	prime	\N	\N	mantech	2025-11-05 17:02:38.288563+00
990	337	ManTech	partner	\N	\N	mantech	2025-11-05 17:02:38.288563+00
991	339	ManTech	prime	\N	\N	mantech	2025-11-05 17:02:44.5276+00
992	339	ManTech	partner	\N	\N	mantech	2025-11-05 17:02:44.5276+00
993	340	Boeing	prime	\N	\N	boeing	2025-11-05 17:02:47.592597+00
994	340	Boeing	partner	\N	\N	boeing	2025-11-05 17:02:47.592597+00
995	340	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:02:47.592597+00
996	341	Teledyne Scientific & Imaging LLC	prime	\N	\N	teledyne scientific & imaging	2025-11-05 17:02:50.685714+00
997	341	Teledyne Scientific & Imaging LLC	partner	\N	\N	teledyne scientific & imaging	2025-11-05 17:02:50.685714+00
998	342	Boeing	prime	\N	\N	boeing	2025-11-05 17:02:53.91832+00
999	342	Boeing	partner	\N	\N	boeing	2025-11-05 17:02:53.91832+00
1000	346	Lockheed Martin	prime	\N	\N	lockheed martin	2025-11-05 17:03:06.201551+00
1001	346	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:03:06.201551+00
1002	348	Qore LLC	prime	\N	\N	qore	2025-11-05 17:03:12.312843+00
1003	348	Qore LLC	partner	\N	\N	qore	2025-11-05 17:03:12.312843+00
1004	351	Complex Integrated Systems	prime	\N	\N	complex integrated systems	2025-11-05 17:03:21.524987+00
1005	351	Complex Integrated Systems	partner	\N	\N	complex integrated systems	2025-11-05 17:03:21.524987+00
1006	351	Boeing	partner	\N	\N	boeing	2025-11-05 17:03:21.524987+00
1007	354	ManTech	prime	\N	\N	mantech	2025-11-05 17:03:31.269212+00
1008	354	ManTech	partner	\N	\N	mantech	2025-11-05 17:03:31.269212+00
1009	356	Wason Technology LLC	prime	\N	\N	wason technology	2025-11-05 17:03:37.585999+00
1010	356	Wason Technology LLC	partner	\N	\N	wason technology	2025-11-05 17:03:37.585999+00
1011	356	Northrop Grumman Corporation	partner	\N	\N	northrop grumman corporation	2025-11-05 17:03:37.585999+00
1012	356	Virtual Commissioning of Advanced Robotic Systems	partner	\N	\N	virtual commissioning of advanced robotic systems	2025-11-05 17:03:37.585999+00
1013	356	Manufacturing Automation Systems	partner	\N	\N	manufacturing automation systems	2025-11-05 17:03:37.585999+00
1014	356	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:03:37.585999+00
1015	356	Northrop Grumman	partner	\N	\N	northrop grumman	2025-11-05 17:03:37.585999+00
1016	358	ManTech	prime	\N	\N	mantech	2025-11-05 17:03:43.951206+00
1017	358	ManTech	partner	\N	\N	mantech	2025-11-05 17:03:43.951206+00
1018	359	AFRL Collaborative Automation for Manufacturing Systems	prime	\N	\N	afrl collaborative automation for manufacturing systems	2025-11-05 17:03:47.297895+00
1019	359	AFRL Collaborative Automation for Manufacturing Systems	partner	\N	\N	afrl collaborative automation for manufacturing systems	2025-11-05 17:03:47.297895+00
1020	359	Collaborative Automation for Manufacturing Systems	partner	\N	\N	collaborative automation for manufacturing systems	2025-11-05 17:03:47.297895+00
1021	360	Kao Corporation	prime	\N	\N	kao corporation	2025-11-05 17:03:50.456932+00
1022	360	Kao Corporation	partner	\N	\N	kao corporation	2025-11-05 17:03:50.456932+00
1023	362	Lockheed Martin	prime	\N	\N	lockheed martin	2025-11-05 17:03:56.855923+00
1024	362	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:03:56.855923+00
1025	362	Boeing	partner	\N	\N	boeing	2025-11-05 17:03:56.855923+00
1026	364	Square One Systems	prime	\N	\N	square one systems	2025-11-05 17:04:03.209359+00
1027	364	Square One Systems	partner	\N	\N	square one systems	2025-11-05 17:04:03.209359+00
1028	364	Kennon Products with Square One Systems	partner	\N	\N	kennon products with square one systems	2025-11-05 17:04:03.209359+00
1029	366	Immer from GE Aerospace	prime	\N	\N	immer from ge aerospace	2025-11-05 17:04:09.546892+00
1030	366	Immer from GE Aerospace	partner	\N	\N	immer from ge aerospace	2025-11-05 17:04:09.546892+00
1031	366	Northrop Grumman	partner	\N	\N	northrop grumman	2025-11-05 17:04:09.546892+00
1032	369	Ross performed strategic planning at General Dynamics	prime	\N	\N	ross performed strategic planning at general dynamics	2025-11-05 17:04:18.794501+00
1033	369	Ross performed strategic planning at General Dynamics	partner	\N	\N	ross performed strategic planning at general dynamics	2025-11-05 17:04:18.794501+00
1034	369	Siemens Digital Industries	partner	\N	\N	siemens digital industries	2025-11-05 17:04:18.794501+00
1035	369	General Dynamics	partner	\N	\N	general dynamics	2025-11-05 17:04:18.794501+00
1036	372	ManTech	prime	\N	\N	mantech	2025-11-05 17:04:27.499434+00
1037	372	ManTech	partner	\N	\N	mantech	2025-11-05 17:04:27.499434+00
1038	377	Boeing	prime	\N	\N	boeing	2025-11-05 17:04:42.633643+00
1039	377	Boeing	partner	\N	\N	boeing	2025-11-05 17:04:42.633643+00
1040	377	Raytheon	partner	\N	\N	raytheon	2025-11-05 17:04:42.633643+00
1041	380	Michigan Economic Development Corporation	prime	\N	\N	michigan economic development corporation	2025-11-05 17:04:51.885662+00
1042	380	Michigan Economic Development Corporation	partner	\N	\N	michigan economic development corporation	2025-11-05 17:04:51.885662+00
1043	380	CEO of the Michigan Economic Development Corporation	partner	\N	\N	ceo of the michigan economic development corporation	2025-11-05 17:04:51.885662+00
1044	385	Lockheed Martin Corporation	prime	\N	\N	lockheed martin corporation	2025-11-05 17:05:08.068375+00
1045	385	Lockheed Martin Corporation	partner	\N	\N	lockheed martin corporation	2025-11-05 17:05:08.068375+00
1046	385	Northrop Grumman Systems Corporation	partner	\N	\N	northrop grumman systems corporation	2025-11-05 17:05:08.068375+00
1047	385	Northrop Grumman Systems	partner	\N	\N	northrop grumman systems	2025-11-05 17:05:08.068375+00
1048	385	ManTech	partner	\N	\N	mantech	2025-11-05 17:05:08.068375+00
1049	385	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:05:08.068375+00
1050	385	Northrop Grumman	partner	\N	\N	northrop grumman	2025-11-05 17:05:08.068375+00
1051	386	Dyndrite Corporation	prime	\N	\N	dyndrite corporation	2025-11-05 17:05:11.88942+00
1052	386	Dyndrite Corporation	partner	\N	\N	dyndrite corporation	2025-11-05 17:05:11.88942+00
1053	386	ManTech	partner	\N	\N	mantech	2025-11-05 17:05:11.88942+00
1054	391	Carbon Thermal Protection Systems	prime	\N	\N	carbon thermal protection systems	2025-11-05 17:05:28.522125+00
1055	391	Carbon Thermal Protection Systems	partner	\N	\N	carbon thermal protection systems	2025-11-05 17:05:28.522125+00
1056	391	ManTech	partner	\N	\N	mantech	2025-11-05 17:05:28.522125+00
1057	392	Raytheon	prime	\N	\N	raytheon	2025-11-05 17:05:31.475603+00
1058	392	Raytheon	partner	\N	\N	raytheon	2025-11-05 17:05:31.475603+00
1059	394	ManTech	prime	\N	\N	mantech	2025-11-05 17:05:37.770528+00
1060	394	ManTech	partner	\N	\N	mantech	2025-11-05 17:05:37.770528+00
1063	403	ManTech	prime	\N	\N	mantech	2025-11-05 17:06:06.372282+00
1064	403	ManTech	partner	\N	\N	mantech	2025-11-05 17:06:06.372282+00
1065	403	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:06:06.372282+00
1066	404	ManTech	prime	\N	\N	mantech	2025-11-05 17:06:09.468681+00
1067	404	ManTech	partner	\N	\N	mantech	2025-11-05 17:06:09.468681+00
1068	408	Friedman Research Corporation	prime	\N	\N	friedman research corporation	2025-11-05 17:06:22.032324+00
1069	408	Friedman Research Corporation	partner	\N	\N	friedman research corporation	2025-11-05 17:06:22.032324+00
1061	398	ManTech	prime	\N	\N	mantech	2025-11-05 17:05:50.644942+00
1062	398	ManTech	partner	\N	\N	mantech	2025-11-05 17:05:50.644942+00
1070	411	ManTech	prime	\N	\N	mantech	2025-11-05 17:06:32.589761+00
1071	411	ManTech	partner	\N	\N	mantech	2025-11-05 17:06:32.589761+00
1072	411	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:06:32.589761+00
1073	422	ManTech	prime	\N	\N	mantech	2025-11-05 17:07:41.565045+00
1074	422	ManTech	partner	\N	\N	mantech	2025-11-05 17:07:41.565045+00
1075	424	Dyndrite Corporation	prime	\N	\N	dyndrite corporation	2025-11-05 17:07:48.049268+00
1076	424	Dyndrite Corporation	partner	\N	\N	dyndrite corporation	2025-11-05 17:07:48.049268+00
1077	424	Eaton Corporation	partner	\N	\N	eaton corporation	2025-11-05 17:07:48.049268+00
1078	424	Product Evaluation Systems	partner	\N	\N	product evaluation systems	2025-11-05 17:07:48.049268+00
1079	424	Boeing	partner	\N	\N	boeing	2025-11-05 17:07:48.049268+00
1080	431	ManTech	prime	\N	\N	mantech	2025-11-05 17:08:08.140061+00
1081	431	ManTech	partner	\N	\N	mantech	2025-11-05 17:08:08.140061+00
1082	432	ManTech	prime	\N	\N	mantech	2025-11-05 17:08:11.389773+00
1083	432	ManTech	partner	\N	\N	mantech	2025-11-05 17:08:11.389773+00
1084	433	ManTech	prime	\N	\N	mantech	2025-11-05 17:08:14.521332+00
1085	433	ManTech	partner	\N	\N	mantech	2025-11-05 17:08:14.521332+00
1086	435	Siemens Digital Industries	prime	\N	\N	siemens digital industries	2025-11-05 17:08:20.960976+00
1087	435	Siemens Digital Industries	partner	\N	\N	siemens digital industries	2025-11-05 17:08:20.960976+00
1088	436	Lightweight Hydrogen Fuel Cells for Unmanned Aerial Systems	prime	\N	\N	lightweight hydrogen fuel cells for unmanned aerial systems	2025-11-05 17:08:24.081417+00
1089	436	Lightweight Hydrogen Fuel Cells for Unmanned Aerial Systems	partner	\N	\N	lightweight hydrogen fuel cells for unmanned aerial systems	2025-11-05 17:08:24.081417+00
1090	436	Electric Power Systems	partner	\N	\N	electric power systems	2025-11-05 17:08:24.081417+00
1091	436	Advanced Automation for Agile Aerospace	partner	\N	\N	advanced automation for agile aerospace	2025-11-05 17:08:24.081417+00
1092	436	ManTech	partner	\N	\N	mantech	2025-11-05 17:08:24.081417+00
1093	436	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:08:24.081417+00
1094	436	Boeing	partner	\N	\N	boeing	2025-11-05 17:08:24.081417+00
1095	438	ManTech	prime	\N	\N	mantech	2025-11-05 17:08:30.426453+00
1096	438	ManTech	partner	\N	\N	mantech	2025-11-05 17:08:30.426453+00
1097	439	ManTech	prime	\N	\N	mantech	2025-11-05 17:08:33.725558+00
1098	439	ManTech	partner	\N	\N	mantech	2025-11-05 17:08:33.725558+00
1099	441	Spirit AeroSystems	prime	\N	\N	spirit aerosystems	2025-11-05 17:08:39.881889+00
1100	441	Spirit AeroSystems	partner	\N	\N	spirit aerosystems	2025-11-05 17:08:39.881889+00
1101	441	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:08:39.881889+00
1102	444	ManTech	prime	\N	\N	mantech	2025-11-05 17:08:49.410961+00
1103	444	ManTech	partner	\N	\N	mantech	2025-11-05 17:08:49.410961+00
1104	448	Ohio Aluminum Industries	prime	\N	\N	ohio aluminum industries	2025-11-05 17:09:02.130259+00
1105	448	Ohio Aluminum Industries	partner	\N	\N	ohio aluminum industries	2025-11-05 17:09:02.130259+00
1106	450	ManTech	prime	\N	\N	mantech	2025-11-05 17:09:08.385735+00
1107	450	ManTech	partner	\N	\N	mantech	2025-11-05 17:09:08.385735+00
1108	452	From planes and tanks to Unmanned Aircraft Systems	prime	\N	\N	from planes and tanks to unmanned aircraft systems	2025-11-05 17:09:14.636992+00
1109	452	From planes and tanks to Unmanned Aircraft Systems	partner	\N	\N	from planes and tanks to unmanned aircraft systems	2025-11-05 17:09:14.636992+00
1110	452	ManTech	partner	\N	\N	mantech	2025-11-05 17:09:14.636992+00
1111	455	Sentient Science Corporation	prime	\N	\N	sentient science corporation	2025-11-05 17:09:24.115772+00
1112	455	Sentient Science Corporation	partner	\N	\N	sentient science corporation	2025-11-05 17:09:24.115772+00
1113	455	Boeing	partner	\N	\N	boeing	2025-11-05 17:09:24.115772+00
1114	455	Raytheon	partner	\N	\N	raytheon	2025-11-05 17:09:24.115772+00
1115	457	Keith Friedman Friedman Research Corporation	prime	\N	\N	keith friedman friedman research corporation	2025-11-05 17:09:30.811343+00
1116	457	Keith Friedman Friedman Research Corporation	partner	\N	\N	keith friedman friedman research corporation	2025-11-05 17:09:30.811343+00
1117	462	Automation Engineering Technologies Systems	prime	\N	\N	automation engineering technologies systems	2025-11-05 17:09:46.369+00
1118	462	Automation Engineering Technologies Systems	partner	\N	\N	automation engineering technologies systems	2025-11-05 17:09:46.369+00
1119	463	ManTech	prime	\N	\N	mantech	2025-11-05 17:09:49.477458+00
1120	463	ManTech	partner	\N	\N	mantech	2025-11-05 17:09:49.477458+00
1121	464	Boeing	prime	\N	\N	boeing	2025-11-05 17:09:52.718577+00
1122	464	Boeing	partner	\N	\N	boeing	2025-11-05 17:09:52.718577+00
1123	475	Siemens Corporation	prime	\N	\N	siemens corporation	2025-11-05 17:10:27.398462+00
1124	475	Siemens Corporation	partner	\N	\N	siemens corporation	2025-11-05 17:10:27.398462+00
1125	475	Apparel Robotics Corporation	partner	\N	\N	apparel robotics corporation	2025-11-05 17:10:27.398462+00
1126	475	Spirit AeroSystems	partner	\N	\N	spirit aerosystems	2025-11-05 17:10:27.398462+00
1127	476	Spirit AeroSystems	prime	\N	\N	spirit aerosystems	2025-11-05 17:10:30.492552+00
1128	476	Spirit AeroSystems	partner	\N	\N	spirit aerosystems	2025-11-05 17:10:30.492552+00
1129	476	ARM Member Curtis Richardson from Spirit AeroSystems	partner	\N	\N	arm member curtis richardson from spirit aerosystems	2025-11-05 17:10:30.492552+00
1130	476	Can you tell us about your role at Spirit AeroSystems	partner	\N	\N	can you tell us about your role at spirit aerosystems	2025-11-05 17:10:30.492552+00
1131	476	ARM Institute projects that Spirit AeroSystems	partner	\N	\N	arm institute projects that spirit aerosystems	2025-11-05 17:10:30.492552+00
1132	476	Boeing	partner	\N	\N	boeing	2025-11-05 17:10:30.492552+00
1133	477	Lockheed Martin	prime	\N	\N	lockheed martin	2025-11-05 17:10:33.683945+00
1134	477	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:10:33.683945+00
1135	488	ManTech	prime	\N	\N	mantech	2025-11-05 17:11:05.578749+00
1136	488	ManTech	partner	\N	\N	mantech	2025-11-05 17:11:05.578749+00
1137	498	ManTech	prime	\N	\N	mantech	2025-11-05 17:11:35.357419+00
1138	498	ManTech	partner	\N	\N	mantech	2025-11-05 17:11:35.357419+00
1139	503	ManTech	prime	\N	\N	mantech	2025-11-05 17:11:50.996409+00
1140	503	ManTech	partner	\N	\N	mantech	2025-11-05 17:11:50.996409+00
1141	504	ManTech	prime	\N	\N	mantech	2025-11-05 17:11:54.113608+00
1142	504	ManTech	partner	\N	\N	mantech	2025-11-05 17:11:54.113608+00
1143	509	Jason worked at Gentex Corporation	prime	\N	\N	jason worked at gentex corporation	2025-11-05 17:12:09.605188+00
1144	509	Jason worked at Gentex Corporation	partner	\N	\N	jason worked at gentex corporation	2025-11-05 17:12:09.605188+00
1145	509	Textron	partner	\N	\N	textron	2025-11-05 17:12:09.605188+00
1146	514	ManTech	prime	\N	\N	mantech	2025-11-05 17:12:26.008502+00
1147	514	ManTech	partner	\N	\N	mantech	2025-11-05 17:12:26.008502+00
1148	515	Marine Corps Systems	prime	\N	\N	marine corps systems	2025-11-05 17:12:29.032017+00
1149	515	Marine Corps Systems	partner	\N	\N	marine corps systems	2025-11-05 17:12:29.032017+00
1150	515	ManTech	partner	\N	\N	mantech	2025-11-05 17:12:29.032017+00
1161	521	ManTech	prime	\N	\N	mantech	2025-11-05 17:12:48.930202+00
1162	521	ManTech	partner	\N	\N	mantech	2025-11-05 17:12:48.930202+00
1172	527	ManTech	prime	\N	\N	mantech	2025-11-05 17:13:09.45074+00
1173	527	ManTech	partner	\N	\N	mantech	2025-11-05 17:13:09.45074+00
1177	531	ManTech	prime	\N	\N	mantech	2025-11-05 17:13:22.836859+00
1178	531	ManTech	partner	\N	\N	mantech	2025-11-05 17:13:22.836859+00
1181	541	ManTech	prime	\N	\N	mantech	2025-11-05 17:13:55.560678+00
1182	541	ManTech	partner	\N	\N	mantech	2025-11-05 17:13:55.560678+00
1185	553	AWE Management Limited	prime	\N	\N	awe management limited	2025-11-05 17:14:35.0733+00
1186	553	AWE Management Limited	partner	\N	\N	awe management limited	2025-11-05 17:14:35.0733+00
1187	553	Raytheon Company and United Technologies Corporation	partner	\N	\N	raytheon company and united technologies corporation	2025-11-05 17:14:35.0733+00
1188	553	One example is Impresa Aerospace	partner	\N	\N	one example is impresa aerospace	2025-11-05 17:14:35.0733+00
1189	553	Lockheed and General Dynamics	partner	\N	\N	lockheed and general dynamics	2025-11-05 17:14:35.0733+00
1190	553	Rotary and Mission Systems	partner	\N	\N	rotary and mission systems	2025-11-05 17:14:35.0733+00
1191	553	Within the Rotary and Mission Systems	partner	\N	\N	within the rotary and mission systems	2025-11-05 17:14:35.0733+00
1192	553	Collins Aerospace Systems	partner	\N	\N	collins aerospace systems	2025-11-05 17:14:35.0733+00
1193	553	General Dynamics General Dynamics	partner	\N	\N	general dynamics general dynamics	2025-11-05 17:14:35.0733+00
1194	553	Almost 70 percent of General Dynamics	partner	\N	\N	almost 70 percent of general dynamics	2025-11-05 17:14:35.0733+00
1195	553	Similar to the Marine Systems	partner	\N	\N	similar to the marine systems	2025-11-05 17:14:35.0733+00
1196	553	European Land Systems	partner	\N	\N	european land systems	2025-11-05 17:14:35.0733+00
1197	553	Ordnance and Tactical Systems	partner	\N	\N	ordnance and tactical systems	2025-11-05 17:14:35.0733+00
1198	553	Various sectors of General Dynamics	partner	\N	\N	various sectors of general dynamics	2025-11-05 17:14:35.0733+00
1199	553	Bernard Cap and Aurora Industries	partner	\N	\N	bernard cap and aurora industries	2025-11-05 17:14:35.0733+00
1200	553	Guided Multiple Launch Rocket Systems	partner	\N	\N	guided multiple launch rocket systems	2025-11-05 17:14:35.0733+00
1201	553	Army for technology under the Common Hardware Systems	partner	\N	\N	army for technology under the common hardware systems	2025-11-05 17:14:35.0733+00
1202	553	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:14:35.0733+00
1203	553	Raytheon	partner	\N	\N	raytheon	2025-11-05 17:14:35.0733+00
1204	553	Boeing	partner	\N	\N	boeing	2025-11-05 17:14:35.0733+00
1205	553	General Dynamics	partner	\N	\N	general dynamics	2025-11-05 17:14:35.0733+00
1206	553	Textron	partner	\N	\N	textron	2025-11-05 17:14:35.0733+00
1213	557	ManTech	prime	\N	\N	mantech	2025-11-05 17:14:48.711637+00
1214	557	ManTech	partner	\N	\N	mantech	2025-11-05 17:14:48.711637+00
1151	516	Army Ground Vehicle Systems	prime	\N	\N	army ground vehicle systems	2025-11-05 17:12:32.450132+00
1152	516	Army Ground Vehicle Systems	partner	\N	\N	army ground vehicle systems	2025-11-05 17:12:32.450132+00
1153	516	ManTech	partner	\N	\N	mantech	2025-11-05 17:12:32.450132+00
1154	516	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:12:32.450132+00
1155	517	ManTech	prime	\N	\N	mantech	2025-11-05 17:12:35.745382+00
1156	517	ManTech	partner	\N	\N	mantech	2025-11-05 17:12:35.745382+00
1157	519	Data for Advanced Manufacturing Robotic Systems	prime	\N	\N	data for advanced manufacturing robotic systems	2025-11-05 17:12:42.32955+00
1158	519	Data for Advanced Manufacturing Robotic Systems	partner	\N	\N	data for advanced manufacturing robotic systems	2025-11-05 17:12:42.32955+00
1159	520	ManTech	prime	\N	\N	mantech	2025-11-05 17:12:45.631831+00
1160	520	ManTech	partner	\N	\N	mantech	2025-11-05 17:12:45.631831+00
1163	525	ManTech	prime	\N	\N	mantech	2025-11-05 17:13:02.549424+00
1164	525	ManTech	partner	\N	\N	mantech	2025-11-05 17:13:02.549424+00
1165	526	GTS Qynergy Corporation	prime	\N	\N	gts qynergy corporation	2025-11-05 17:13:05.924014+00
1166	526	GTS Qynergy Corporation	partner	\N	\N	gts qynergy corporation	2025-11-05 17:13:05.924014+00
1167	526	General Dynamics Electric Boat General Dynamics	partner	\N	\N	general dynamics electric boat general dynamics	2025-11-05 17:13:05.924014+00
1168	526	ManTech	partner	\N	\N	mantech	2025-11-05 17:13:05.924014+00
1169	526	Northrop Grumman	partner	\N	\N	northrop grumman	2025-11-05 17:13:05.924014+00
1170	526	Raytheon	partner	\N	\N	raytheon	2025-11-05 17:13:05.924014+00
1171	526	General Dynamics	partner	\N	\N	general dynamics	2025-11-05 17:13:05.924014+00
1179	538	Boeing	prime	\N	\N	boeing	2025-11-05 17:13:45.583634+00
1180	538	Boeing	partner	\N	\N	boeing	2025-11-05 17:13:45.583634+00
1183	550	Boeing	prime	\N	\N	boeing	2025-11-05 17:14:25.650815+00
1184	550	Boeing	partner	\N	\N	boeing	2025-11-05 17:14:25.650815+00
1207	554	ManTech	prime	\N	\N	mantech	2025-11-05 17:14:38.665164+00
1208	554	ManTech	partner	\N	\N	mantech	2025-11-05 17:14:38.665164+00
1209	555	ManTech	prime	\N	\N	mantech	2025-11-05 17:14:42.084062+00
1210	555	ManTech	partner	\N	\N	mantech	2025-11-05 17:14:42.084062+00
1211	556	ManTech	prime	\N	\N	mantech	2025-11-05 17:14:45.405691+00
1212	556	ManTech	partner	\N	\N	mantech	2025-11-05 17:14:45.405691+00
1215	559	Naval Sea Systems	prime	\N	\N	naval sea systems	2025-11-05 17:14:54.000711+00
1216	559	Naval Sea Systems	partner	\N	\N	naval sea systems	2025-11-05 17:14:54.000711+00
1174	529	Integrated Network Systems-of-Systems	prime	\N	\N	integrated network systems-of-systems	2025-11-05 17:13:16.093215+00
1175	529	Integrated Network Systems-of-Systems	partner	\N	\N	integrated network systems-of-systems	2025-11-05 17:13:16.093215+00
1176	529	ManTech	partner	\N	\N	mantech	2025-11-05 17:13:16.093215+00
1217	560	ManTech	prime	\N	\N	mantech	2025-11-05 17:14:57.386564+00
1218	560	ManTech	partner	\N	\N	mantech	2025-11-05 17:14:57.386564+00
1219	562	ManTech	prime	\N	\N	mantech	2025-11-05 17:15:02.820877+00
1220	562	ManTech	partner	\N	\N	mantech	2025-11-05 17:15:02.820877+00
1221	564	ManTech	prime	\N	\N	mantech	2025-11-05 17:15:09.263074+00
1222	564	ManTech	partner	\N	\N	mantech	2025-11-05 17:15:09.263074+00
1223	565	ManTech	prime	\N	\N	mantech	2025-11-05 17:15:12.670236+00
1224	565	ManTech	partner	\N	\N	mantech	2025-11-05 17:15:12.670236+00
1225	566	ManTech	prime	\N	\N	mantech	2025-11-05 17:15:16.961907+00
1226	566	ManTech	partner	\N	\N	mantech	2025-11-05 17:15:16.961907+00
1227	567	ManTech	prime	\N	\N	mantech	2025-11-05 17:15:20.298151+00
1228	567	ManTech	partner	\N	\N	mantech	2025-11-05 17:15:20.298151+00
1229	568	ManTech	prime	\N	\N	mantech	2025-11-05 17:15:23.582413+00
1230	568	ManTech	partner	\N	\N	mantech	2025-11-05 17:15:23.582413+00
1231	569	ManTech	prime	\N	\N	mantech	2025-11-05 17:15:27.167127+00
1232	569	ManTech	partner	\N	\N	mantech	2025-11-05 17:15:27.167127+00
1233	570	ManTech	prime	\N	\N	mantech	2025-11-05 17:15:31.012338+00
1234	570	ManTech	partner	\N	\N	mantech	2025-11-05 17:15:31.012338+00
1235	574	URLLC	prime	\N	\N	urllc	2025-11-05 17:15:43.191465+00
1236	574	URLLC	partner	\N	\N	urllc	2025-11-05 17:15:43.191465+00
1237	575	Xerox Corporation	prime	\N	\N	xerox corporation	2025-11-05 17:15:46.615476+00
1238	575	Xerox Corporation	partner	\N	\N	xerox corporation	2025-11-05 17:15:46.615476+00
1239	575	ElemX are trademarks of Xerox Corporation	partner	\N	\N	elemx are trademarks of xerox corporation	2025-11-05 17:15:46.615476+00
1240	575	Chair of NPS Mechanical and Aerospace	partner	\N	\N	chair of nps mechanical and aerospace	2025-11-05 17:15:46.615476+00
1241	581	Naval Air Systems	prime	\N	\N	naval air systems	2025-11-05 17:16:05.230599+00
1242	581	Naval Air Systems	partner	\N	\N	naval air systems	2025-11-05 17:16:05.230599+00
1243	581	Georgia Naval Air Systems	partner	\N	\N	georgia naval air systems	2025-11-05 17:16:05.230599+00
1244	585	Marine Corps Systems	prime	\N	\N	marine corps systems	2025-11-05 17:16:18.308158+00
1245	585	Marine Corps Systems	partner	\N	\N	marine corps systems	2025-11-05 17:16:18.308158+00
1246	585	Naval Sea Systems	partner	\N	\N	naval sea systems	2025-11-05 17:16:18.308158+00
1247	588	Space and Naval Warfare Systems	prime	\N	\N	space and naval warfare systems	2025-11-05 17:16:27.948308+00
1248	588	Space and Naval Warfare Systems	partner	\N	\N	space and naval warfare systems	2025-11-05 17:16:27.948308+00
1249	588	Boeing	partner	\N	\N	boeing	2025-11-05 17:16:27.948308+00
1250	589	Advanced Automation for Agile Aerospace	prime	\N	\N	advanced automation for agile aerospace	2025-11-05 17:16:31.143902+00
1251	589	Advanced Automation for Agile Aerospace	partner	\N	\N	advanced automation for agile aerospace	2025-11-05 17:16:31.143902+00
1252	589	ManTech	partner	\N	\N	mantech	2025-11-05 17:16:31.143902+00
1253	593	ManTech	prime	\N	\N	mantech	2025-11-05 17:16:42.679247+00
1254	593	ManTech	partner	\N	\N	mantech	2025-11-05 17:16:42.679247+00
1255	600	Amazon Robotics LLC	prime	\N	\N	amazon robotics	2025-11-05 17:17:04.770034+00
1256	600	Amazon Robotics LLC	partner	\N	\N	amazon robotics	2025-11-05 17:17:04.770034+00
1257	600	BirdBrain Technologies LLC	partner	\N	\N	birdbrain technologies	2025-11-05 17:17:04.770034+00
1258	600	ESCO Corporation	partner	\N	\N	esco corporation	2025-11-05 17:17:04.770034+00
1259	600	Euclid Automation LLC	partner	\N	\N	euclid automation	2025-11-05 17:17:04.770034+00
1260	600	FANUC America Corporation	partner	\N	\N	fanuc america corporation	2025-11-05 17:17:04.770034+00
1261	600	International Electronic Machines Corporation	partner	\N	\N	international electronic machines corporation	2025-11-05 17:17:04.770034+00
1262	600	Ion Pacific Limited	partner	\N	\N	ion pacific limited	2025-11-05 17:17:04.770034+00
1263	600	JTEKT North America Corporation	partner	\N	\N	jtekt north america corporation	2025-11-05 17:17:04.770034+00
1264	600	Lockheed Martin Corporation	partner	\N	\N	lockheed martin corporation	2025-11-05 17:17:04.770034+00
1265	600	Luna Innovations Incorporated	partner	\N	\N	luna innovations incorporated	2025-11-05 17:17:04.770034+00
1266	600	MPI Incorporated	partner	\N	\N	mpi incorporated	2025-11-05 17:17:04.770034+00
1267	600	Northrop Grumman Systems Corporation	partner	\N	\N	northrop grumman systems corporation	2025-11-05 17:17:04.770034+00
1268	600	Pack Flow Concepts LLC	partner	\N	\N	pack flow concepts	2025-11-05 17:17:04.770034+00
1269	600	Robert Bosch LLC	partner	\N	\N	robert bosch	2025-11-05 17:17:04.770034+00
1270	600	Schlumberger Technology Corporation	partner	\N	\N	schlumberger technology corporation	2025-11-05 17:17:04.770034+00
1271	600	Siemens Corporation	partner	\N	\N	siemens corporation	2025-11-05 17:17:04.770034+00
1272	600	Staubli Corporation	partner	\N	\N	staubli corporation	2025-11-05 17:17:04.770034+00
1273	600	Regional Industrial Development Corporation	partner	\N	\N	regional industrial development corporation	2025-11-05 17:17:04.770034+00
1274	600	Delphi Automotive Systems	partner	\N	\N	delphi automotive systems	2025-11-05 17:17:04.770034+00
1275	600	General Dynamics Land Systems	partner	\N	\N	general dynamics land systems	2025-11-05 17:17:04.770034+00
1276	600	Guided Particle Systems	partner	\N	\N	guided particle systems	2025-11-05 17:17:04.770034+00
1277	600	Northrop Grumman Systems	partner	\N	\N	northrop grumman systems	2025-11-05 17:17:04.770034+00
1278	600	General Dynamics	partner	\N	\N	general dynamics	2025-11-05 17:17:04.770034+00
1279	600	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:17:04.770034+00
1280	600	Northrop Grumman	partner	\N	\N	northrop grumman	2025-11-05 17:17:04.770034+00
1281	600	Raytheon	partner	\N	\N	raytheon	2025-11-05 17:17:04.770034+00
1282	604	ManTech	prime	\N	\N	mantech	2025-11-05 17:17:18.288054+00
1283	604	ManTech	partner	\N	\N	mantech	2025-11-05 17:17:18.288054+00
1284	605	Boeing	prime	\N	\N	boeing	2025-11-05 17:17:21.636053+00
1285	605	Boeing	partner	\N	\N	boeing	2025-11-05 17:17:21.636053+00
1286	606	Boeing	prime	\N	\N	boeing	2025-11-05 17:17:24.943475+00
1287	606	Boeing	partner	\N	\N	boeing	2025-11-05 17:17:24.943475+00
1288	608	ManTech	prime	\N	\N	mantech	2025-11-05 17:17:31.172016+00
1289	608	ManTech	partner	\N	\N	mantech	2025-11-05 17:17:31.172016+00
1290	609	ManTech	prime	\N	\N	mantech	2025-11-05 17:17:34.543916+00
1291	609	ManTech	partner	\N	\N	mantech	2025-11-05 17:17:34.543916+00
1292	612	Kaminski Most Promising Systems	prime	\N	\N	kaminski most promising systems	2025-11-05 17:17:44.368815+00
1293	612	Kaminski Most Promising Systems	partner	\N	\N	kaminski most promising systems	2025-11-05 17:17:44.368815+00
1294	612	ManTech	partner	\N	\N	mantech	2025-11-05 17:17:44.368815+00
1295	615	ManTech	prime	\N	\N	mantech	2025-11-05 17:17:54.304341+00
1296	615	ManTech	partner	\N	\N	mantech	2025-11-05 17:17:54.304341+00
1297	615	Northrop Grumman	partner	\N	\N	northrop grumman	2025-11-05 17:17:54.304341+00
1298	616	Boeing	prime	\N	\N	boeing	2025-11-05 17:17:57.656838+00
1299	616	Boeing	partner	\N	\N	boeing	2025-11-05 17:17:57.656838+00
1300	616	Northrop Grumman	partner	\N	\N	northrop grumman	2025-11-05 17:17:57.656838+00
1301	616	Lockheed Martin	partner	\N	\N	lockheed martin	2025-11-05 17:17:57.656838+00
1302	616	Raytheon	partner	\N	\N	raytheon	2025-11-05 17:17:57.656838+00
1303	617	Leveraging Space and Missile Systems	prime	\N	\N	leveraging space and missile systems	2025-11-05 17:18:00.848264+00
1304	617	Leveraging Space and Missile Systems	partner	\N	\N	leveraging space and missile systems	2025-11-05 17:18:00.848264+00
1305	617	ManTech	partner	\N	\N	mantech	2025-11-05 17:18:00.848264+00
1306	618	ManTech	prime	\N	\N	mantech	2025-11-05 17:18:03.271716+00
1307	618	ManTech	partner	\N	\N	mantech	2025-11-05 17:18:03.271716+00
1308	619	Northrop Grumman Corporation	prime	\N	\N	northrop grumman corporation	2025-11-05 17:18:06.461392+00
1309	619	Northrop Grumman Corporation	partner	\N	\N	northrop grumman corporation	2025-11-05 17:18:06.461392+00
1310	619	ManTech	partner	\N	\N	mantech	2025-11-05 17:18:06.461392+00
1311	619	Northrop Grumman	partner	\N	\N	northrop grumman	2025-11-05 17:18:06.461392+00
1312	620	ManTech	prime	\N	\N	mantech	2025-11-05 17:18:09.547762+00
1313	620	ManTech	partner	\N	\N	mantech	2025-11-05 17:18:09.547762+00
\.


--
-- Name: mantech_company_mentions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mantech_company_mentions_id_seq', 1313, true);


--
-- Name: mantech_company_mentions mantech_company_mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantech_company_mentions
    ADD CONSTRAINT mantech_company_mentions_pkey PRIMARY KEY (id);


--
-- Name: mantech_company_mentions mantech_company_mentions_project_id_company_name_mention_ty_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantech_company_mentions
    ADD CONSTRAINT mantech_company_mentions_project_id_company_name_mention_ty_key UNIQUE (project_id, company_name, mention_type);


--
-- Name: idx_mantech_mentions_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantech_mentions_company ON public.mantech_company_mentions USING btree (company_name);


--
-- Name: idx_mantech_mentions_normalized; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantech_mentions_normalized ON public.mantech_company_mentions USING btree (company_normalized);


--
-- Name: idx_mantech_mentions_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantech_mentions_project ON public.mantech_company_mentions USING btree (project_id);


--
-- Name: idx_mantech_mentions_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mantech_mentions_type ON public.mantech_company_mentions USING btree (mention_type);


--
-- Name: mantech_company_mentions mantech_company_mentions_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mantech_company_mentions
    ADD CONSTRAINT mantech_company_mentions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.mantech_projects(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict K0Fceyamprd279bijMyZjV28YIqQ0vOz1uq87tmXt1fP8G4E2IXeVrVAKrr5R2U

