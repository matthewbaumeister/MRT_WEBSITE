--
-- PostgreSQL database dump
--

\restrict ILfsfD6UFZlNUoB1OEnF8FaVlYsjHWFzVAE4Oihq6XmU3cXOoE1AeDBbxYrWkmY

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

--
-- Name: army_innovation_phase_progress; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.army_innovation_phase_progress AS
 SELECT id,
    opportunity_title,
    status,
    competition_phase,
    current_phase_number,
    total_phases,
    phase_progress_percentage,
    evaluation_stages,
        CASE
            WHEN ((current_phase_number IS NOT NULL) AND (total_phases IS NOT NULL)) THEN ((('Phase '::text || current_phase_number) || ' of '::text) || total_phases)
            ELSE competition_phase
        END AS phase_display,
        CASE
            WHEN (status = 'Closed'::text) THEN 'Complete'::text
            WHEN ((status = 'Active'::text) AND (current_phase_number = total_phases)) THEN 'Final Phase'::text
            WHEN ((status = 'Active'::text) AND (current_phase_number < total_phases)) THEN 'In Progress'::text
            ELSE 'Unknown'::text
        END AS phase_status,
    close_date,
    submission_deadline
   FROM public.army_innovation_opportunities
  ORDER BY
        CASE status
            WHEN 'Active'::text THEN 1
            WHEN 'Open'::text THEN 2
            ELSE 3
        END, close_date DESC NULLS LAST;


--
-- PostgreSQL database dump complete
--

\unrestrict ILfsfD6UFZlNUoB1OEnF8FaVlYsjHWFzVAE4Oihq6XmU3cXOoE1AeDBbxYrWkmY

