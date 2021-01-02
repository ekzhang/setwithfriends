import { useState } from "react";

import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import InternalLink from "../components/InternalLink";

// Created with GetTerms - https://getterms.io/

const TermsOfService = () => (
  <>
    <Typography variant="h5" align="center">
      Terms of Service
    </Typography>
    <Typography variant="subtitle1" align="center" gutterBottom>
      Last modified: December 31, 2020
    </Typography>

    <Typography variant="h6">1. Terms</Typography>
    <Typography variant="body1" gutterBottom>
      By accessing the website at{" "}
      <Link href="/">https://setwithfriends.com/</Link>, you are agreeing to be
      bound by these terms of service, all applicable laws and regulations, and
      agree that you are responsible for compliance with any applicable local
      laws. If you do not agree with any of these terms, you are prohibited from
      using or accessing this site. The materials contained in this website are
      protected by applicable copyright and trademark law.
    </Typography>

    <Typography variant="h6">2. Use License</Typography>
    <Typography variant="body1" gutterBottom>
      Permission is granted to temporarily download one copy of the materials
      (information or software) on Set with Friends' website for personal,
      non-commercial transitory viewing only. This is the grant of a license,
      not a transfer of title, and under this license you may not:
    </Typography>
    <Typography component="div" variant="body1" gutterBottom>
      <ul>
        <li>modify or copy the materials;</li>
        <li>
          use the materials for any commercial purpose, or for any public
          display (commercial or non-commercial);
        </li>
        <li>
          attempt to decompile or reverse engineer any software contained on Set
          with Friends' website;
        </li>
        <li>
          remove any copyright or other proprietary notations from the
          materials; or
        </li>
        <li>
          transfer the materials to another person or "mirror" the materials on
          any other server.
        </li>
      </ul>
    </Typography>
    <Typography variant="body1" gutterBottom>
      This license shall automatically terminate if you violate any of these
      restrictions and may be terminated by Set with Friends at any time. Upon
      terminating your viewing of these materials or upon the termination of
      this license, you must destroy any downloaded materials in your possession
      whether in electronic or printed format.
    </Typography>

    <Typography variant="h6">3. Disclaimer</Typography>
    <Typography variant="body1" gutterBottom>
      The materials on Set with Friends' website are provided on an 'as is'
      basis. Set with Friends makes no warranties, expressed or implied, and
      hereby disclaims and negates all other warranties including, without
      limitation, implied warranties or conditions of merchantability, fitness
      for a particular purpose, or non-infringement of intellectual property or
      other violation of rights.
    </Typography>
    <Typography variant="body1" gutterBottom>
      Further, Set with Friends does not warrant or make any representations
      concerning the accuracy, likely results, or reliability of the use of the
      materials on its website or otherwise relating to such materials or on any
      sites linked to this site.
    </Typography>

    <Typography variant="h6">4. Limitations</Typography>
    <Typography variant="body1" gutterBottom>
      In no event shall Set with Friends or its suppliers be liable for any
      damages (including, without limitation, damages for loss of data or
      profit, or due to business interruption) arising out of the use or
      inability to use the materials on Set with Friends' website, even if Set
      with Friends or a Set with Friends authorized representative has been
      notified orally or in writing of the possibility of such damage. Because
      some jurisdictions do not allow limitations on implied warranties, or
      limitations of liability for consequential or incidental damages, these
      limitations may not apply to you.
    </Typography>

    <Typography variant="h6">5. Accuracy of materials</Typography>
    <Typography variant="body1" gutterBottom>
      The materials appearing on Set with Friends' website could include
      technical, typographical, or photographic errors. Set with Friends does
      not warrant that any of the materials on its website are accurate,
      complete or current. Set with Friends may make changes to the materials
      contained on its website at any time without notice. However Set with
      Friends does not make any commitment to update the materials.
    </Typography>

    <Typography variant="h6">6. Links</Typography>
    <Typography variant="body1" gutterBottom>
      Set with Friends has not reviewed all of the sites linked to its website
      and is not responsible for the contents of any such linked site. The
      inclusion of any link does not imply endorsement by Set with Friends of
      the site. Use of any such linked website is at the user's own risk.
    </Typography>

    <Typography variant="h6">7. Modifications</Typography>
    <Typography variant="body1" gutterBottom>
      Set with Friends may revise these terms of service for its website at any
      time without notice. By using this website you are agreeing to be bound by
      the then current version of these terms of service.
    </Typography>

    <Typography variant="h6">8. Governing Law</Typography>
    <Typography variant="body1" gutterBottom>
      These terms and conditions are governed by and construed in accordance
      with the laws of the United States and you irrevocably submit to the
      exclusive jurisdiction of the courts in that State or location.
    </Typography>
  </>
);

const PrivacyPolicy = () => (
  <>
    <Typography variant="h5" align="center">
      Privacy Policy
    </Typography>
    <Typography variant="subtitle1" align="center" gutterBottom>
      Last modified: December 31, 2020
    </Typography>

    <Typography variant="body1" gutterBottom>
      Your privacy is important to us. It is Set with Friends' policy to respect
      your privacy regarding any information we may collect from you across our
      website, <Link href="/">https://setwithfriends.com/</Link>, and other
      sites we own and operate.
    </Typography>
    <Typography variant="body1" gutterBottom>
      We only ask for personal information when we truly need it to provide a
      service to you. We collect it by fair and lawful means, with your
      knowledge and consent. We also let you know why we’re collecting it and
      how it will be used.
    </Typography>
    <Typography variant="body1" gutterBottom>
      We only retain collected information for as long as necessary to provide
      you with your requested service. What data we store, we’ll protect within
      commercially acceptable means to prevent loss and theft, as well as
      unauthorized access, disclosure, copying, use or modification.
    </Typography>
    <Typography variant="body1" gutterBottom>
      We don’t share any personally identifying information publicly or with
      third-parties, except when required to by law.
    </Typography>
    <Typography variant="body1" gutterBottom>
      Our website may link to external sites that are not operated by us. Please
      be aware that we have no control over the content and practices of these
      sites, and cannot accept responsibility or liability for their respective
      privacy policies.
    </Typography>
    <Typography variant="body1" gutterBottom>
      You are free to refuse our request for your personal information, with the
      understanding that we may be unable to provide you with some of your
      desired services.
    </Typography>
    <Typography variant="body1" gutterBottom>
      Your continued use of our website will be regarded as acceptance of our
      practices around privacy and personal information. If you have any
      questions about how we handle user data and personal information, feel
      free to contact us.
    </Typography>
  </>
);

function LegalPage() {
  const [tab, setTab] = useState("terms");

  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginTop: 24 }}>
        Legal
      </Typography>
      <Tabs
        value={tab}
        onChange={(event, value) => setTab(value)}
        variant="fullWidth"
        style={{ margin: "12px auto -12px auto", maxWidth: 720 }}
      >
        <Tab label="Terms of Service" value="terms" />
        <Tab label="Privacy Policy" value="privacy" />
      </Tabs>
      <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
        {tab === "terms" ? <TermsOfService /> : <PrivacyPolicy />}
      </Paper>
      <Typography
        variant="body1"
        align="center"
        style={{ marginTop: 12, paddingBottom: 12 }}
      >
        <InternalLink to="/">Return to home</InternalLink>
      </Typography>
    </Container>
  );
}

export default LegalPage;
