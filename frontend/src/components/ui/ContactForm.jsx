//src/components/ContactForm.jsx
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

export default function ContactForm() {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: integrar lógica de envío si la necesitas
  };

  return (
    <Card className="login-panel contact-panel">
      <h2 className="login-title">Formulario de Contacto</h2>

      <form onSubmit={onSubmit} className="login-stack">
        {/* Nombres */}
        <div className="login-field">
          <Input
            id="c-nombres"
            name="nombres"
            type="text"
            placeholder="Nombres"
            autoComplete="given-name"
            className="input-soft rounded-xl"
            required
          />
        </div>

        {/* Apellidos */}
        <div className="login-field">
          <Input
            id="c-apellidos"
            name="apellidos"
            type="text"
            placeholder="Apellidos"
            autoComplete="family-name"
            className="input-soft rounded-xl"
            required
          />
        </div>

        {/* Institución */}
        <div className="login-field">
          <Input
            id="c-institucion"
            name="institucion"
            type="text"
            placeholder="Institución"
            autoComplete="organization"
            className="input-soft rounded-xl"
          />
        </div>

        {/* NIT */}
        <div className="login-field">
          <Input
            id="c-nit"
            name="nit"
            type="text"
            placeholder="NIT"
            autoComplete="NIT"
            className="input-soft rounded-xl"
          />
        </div>

        {/* Ciudad */}
        <div className="login-field">
          <Input
            id="c-ciudad"
            name="ciudad"
            type="text"
            placeholder="Ciudad"
            autoComplete="address-level2"
            className="input-soft rounded-xl"
          />
        </div>

        {/* Correo Corporativo */}
        <div className="login-field">
          <Input
            id="c-correocorp"
            name="correo_corporativo"
            type="email"
            placeholder="Correo Corporativo"
            autoComplete="email"
            className="input-soft rounded-xl"
            required
          />
        </div>

        {/* Celular: selector de país + número */}
        <div className="login-field phone-row">
          <select
            id="c-cc"
            name="country_code"
            defaultValue="+57"
            aria-label="Código de país"
            className="w-full rounded-xl border border-brand-border bg-white p-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] input-soft"
            required
          >
            <option value="+93">Afganistán (+93)</option>
            <option value="+355">Albania (+355)</option>
            <option value="+213">Argelia (+213)</option>
            <option value="+376">Andorra (+376)</option>
            <option value="+244">Angola (+244)</option>
            <option value="+1-268">Antigua y Barbuda (+1-268)</option>
            <option value="+54">Argentina (+54)</option>
            <option value="+374">Armenia (+374)</option>
            <option value="+61">Australia (+61)</option>
            <option value="+43">Austria (+43)</option>
            <option value="+994">Azerbaiyán (+994)</option>
            <option value="+1-242">Bahamas (+1-242)</option>
            <option value="+973">Baréin (+973)</option>
            <option value="+880">Bangladés (+880)</option>
            <option value="+1-246">Barbados (+1-246)</option>
            <option value="+375">Bielorrusia (+375)</option>
            <option value="+32">Bélgica (+32)</option>
            <option value="+501">Belice (+501)</option>
            <option value="+229">Benín (+229)</option>
            <option value="+1-441">Bermudas (+1-441)</option>
            <option value="+975">Bután (+975)</option>
            <option value="+591">Bolivia (+591)</option>
            <option value="+387">Bosnia y Herzegovina (+387)</option>
            <option value="+267">Botsuana (+267)</option>
            <option value="+55">Brasil (+55)</option>
            <option value="+1-284">Islas Vírgenes Británicas (+1-284)</option>
            <option value="+673">Brunéi (+673)</option>
            <option value="+359">Bulgaria (+359)</option>
            <option value="+226">Burkina Faso (+226)</option>
            <option value="+257">Burundi (+257)</option>
            <option value="+855">Camboya (+855)</option>
            <option value="+237">Camerún (+237)</option>
            <option value="+1">Canadá (+1)</option>
            <option value="+238">Cabo Verde (+238)</option>
            <option value="+1-345">Islas Caimán (+1-345)</option>
            <option value="+236">Rep. Centroafricana (+236)</option>
            <option value="+235">Chad (+235)</option>
            <option value="+56">Chile (+56)</option>
            <option value="+86">China (+86)</option>
            <option value="+57">Colombia (+57)</option>
            <option value="+269">Comoras (+269)</option>
            <option value="+242">Congo (+242)</option>
            <option value="+682">Islas Cook (+682)</option>
            <option value="+506">Costa Rica (+506)</option>
            <option value="+225">Côte d’Ivoire (+225)</option>
            <option value="+385">Croacia (+385)</option>
            <option value="+53">Cuba (+53)</option>
            <option value="+599">Curazao (+599)</option>
            <option value="+357">Chipre (+357)</option>
            <option value="+420">Chequia (+420)</option>
            <option value="+243">RD del Congo (+243)</option>
            <option value="+45">Dinamarca (+45)</option>
            <option value="+253">Yibuti (+253)</option>
            <option value="+1-767">Dominica (+1-767)</option>
            <option value="+1-809">Rep. Dominicana (+1-809)</option>
            <option value="+1-829">Rep. Dominicana (+1-829)</option>
            <option value="+1-849">Rep. Dominicana (+1-849)</option>
            <option value="+593">Ecuador (+593)</option>
            <option value="+20">Egipto (+20)</option>
            <option value="+503">El Salvador (+503)</option>
            <option value="+240">Guinea Ecuatorial (+240)</option>
            <option value="+291">Eritrea (+291)</option>
            <option value="+372">Estonia (+372)</option>
            <option value="+268">Esuatini (+268)</option>
            <option value="+251">Etiopía (+251)</option>
            <option value="+298">Islas Feroe (+298)</option>
            <option value="+679">Fiyi (+679)</option>
            <option value="+358">Finlandia (+358)</option>
            <option value="+33">Francia (+33)</option>
            <option value="+594">Guayana Francesa (+594)</option>
            <option value="+689">Polinesia Francesa (+689)</option>
            <option value="+241">Gabón (+241)</option>
            <option value="+220">Gambia (+220)</option>
            <option value="+995">Georgia (+995)</option>
            <option value="+49">Alemania (+49)</option>
            <option value="+233">Ghana (+233)</option>
            <option value="+350">Gibraltar (+350)</option>
            <option value="+30">Grecia (+30)</option>
            <option value="+299">Groenlandia (+299)</option>
            <option value="+1-473">Granada (+1-473)</option>
            <option value="+590">Guadalupe (+590)</option>
            <option value="+1-671">Guam (+1-671)</option>
            <option value="+502">Guatemala (+502)</option>
            <option value="+44">Guernsey (+44)</option>
            <option value="+224">Guinea (+224)</option>
            <option value="+245">Guinea-Bisáu (+245)</option>
            <option value="+592">Guyana (+592)</option>
            <option value="+509">Haití (+509)</option>
            <option value="+504">Honduras (+504)</option>
            <option value="+852">Hong Kong (+852)</option>
            <option value="+36">Hungría (+36)</option>
            <option value="+354">Islandia (+354)</option>
            <option value="+91">India (+91)</option>
            <option value="+62">Indonesia (+62)</option>
            <option value="+98">Irán (+98)</option>
            <option value="+964">Irak (+964)</option>
            <option value="+353">Irlanda (+353)</option>
            <option value="+44">Isla de Man (+44)</option>
            <option value="+972">Israel (+972)</option>
            <option value="+39">Italia (+39)</option>
            <option value="+1-876">Jamaica (+1-876)</option>
            <option value="+81">Japón (+81)</option>
            <option value="+44">Jersey (+44)</option>
            <option value="+962">Jordania (+962)</option>
            <option value="+7">Kazajistán (+7)</option>
            <option value="+254">Kenia (+254)</option>
            <option value="+686">Kiribati (+686)</option>
            <option value="+850">Corea del Norte (+850)</option>
            <option value="+82">Corea del Sur (+82)</option>
            <option value="+965">Kuwait (+965)</option>
            <option value="+996">Kirguistán (+996)</option>
            <option value="+856">Laos (+856)</option>
            <option value="+371">Letonia (+371)</option>
            <option value="+961">Líbano (+961)</option>
            <option value="+266">Lesoto (+266)</option>
            <option value="+231">Liberia (+231)</option>
            <option value="+218">Libia (+218)</option>
            <option value="+423">Liechtenstein (+423)</option>
            <option value="+370">Lituania (+370)</option>
            <option value="+352">Luxemburgo (+352)</option>
            <option value="+853">Macao (+853)</option>
            <option value="+261">Madagascar (+261)</option>
            <option value="+265">Malaui (+265)</option>
            <option value="+60">Malasia (+60)</option>
            <option value="+960">Maldivas (+960)</option>
            <option value="+223">Malí (+223)</option>
            <option value="+356">Malta (+356)</option>
            <option value="+692">Islas Marshall (+692)</option>
            <option value="+596">Martinica (+596)</option>
            <option value="+222">Mauritania (+222)</option>
            <option value="+230">Mauricio (+230)</option>
            <option value="+262">Mayotte (+262)</option>
            <option value="+52">México (+52)</option>
            <option value="+691">Micronesia (+691)</option>
            <option value="+373">Moldavia (+373)</option>
            <option value="+377">Mónaco (+377)</option>
            <option value="+976">Mongolia (+976)</option>
            <option value="+382">Montenegro (+382)</option>
            <option value="+1-664">Montserrat (+1-664)</option>
            <option value="+212">Marruecos (+212)</option>
            <option value="+258">Mozambique (+258)</option>
            <option value="+95">Myanmar (+95)</option>
            <option value="+264">Namibia (+264)</option>
            <option value="+674">Nauru (+674)</option>
            <option value="+977">Nepal (+977)</option>
            <option value="+31">Países Bajos (+31)</option>
            <option value="+687">Nueva Caledonia (+687)</option>
            <option value="+64">Nueva Zelanda (+64)</option>
            <option value="+505">Nicaragua (+505)</option>
            <option value="+227">Níger (+227)</option>
            <option value="+234">Nigeria (+234)</option>
            <option value="+683">Niue (+683)</option>
            <option value="+389">Macedonia del Norte (+389)</option>
            <option value="+1-670">Islas Marianas del Norte (+1-670)</option>
            <option value="+47">Noruega (+47)</option>
            <option value="+968">Omán (+968)</option>
            <option value="+92">Pakistán (+92)</option>
            <option value="+680">Palaos (+680)</option>
            <option value="+970">Palestina (+970)</option>
            <option value="+507">Panamá (+507)</option>
            <option value="+675">Papúa Nueva Guinea (+675)</option>
            <option value="+595">Paraguay (+595)</option>
            <option value="+51">Perú (+51)</option>
            <option value="+63">Filipinas (+63)</option>
            <option value="+48">Polonia (+48)</option>
            <option value="+351">Portugal (+351)</option>
            <option value="+1-787">Puerto Rico (+1-787)</option>
            <option value="+1-939">Puerto Rico (+1-939)</option>
            <option value="+974">Catar (+974)</option>
            <option value="+262">Reunión (+262)</option>
            <option value="+40">Rumanía (+40)</option>
            <option value="+7">Rusia (+7)</option>
            <option value="+250">Ruanda (+250)</option>
            <option value="+590">San Bartolomé (+590)</option>
            <option value="+290">Santa Elena (+290)</option>
            <option value="+1-869">San Cristóbal y Nieves (+1-869)</option>
            <option value="+1-758">Santa Lucía (+1-758)</option>
            <option value="+590">San Martín (+590)</option>
            <option value="+508">San Pedro y Miquelón (+508)</option>
            <option value="+1-784">San Vicente y las Granadinas (+1-784)</option>
            <option value="+685">Samoa (+685)</option>
            <option value="+378">San Marino (+378)</option>
            <option value="+239">Santo Tomé y Príncipe (+239)</option>
            <option value="+966">Arabia Saudita (+966)</option>
            <option value="+221">Senegal (+221)</option>
            <option value="+381">Serbia (+381)</option>
            <option value="+248">Seychelles (+248)</option>
            <option value="+232">Sierra Leona (+232)</option>
            <option value="+65">Singapur (+65)</option>
            <option value="+1-721">Sint Maarten (+1-721)</option>
            <option value="+421">Eslovaquia (+421)</option>
            <option value="+386">Eslovenia (+386)</option>
            <option value="+677">Islas Salomón (+677)</option>
            <option value="+252">Somalia (+252)</option>
            <option value="+27">Sudáfrica (+27)</option>
            <option value="+211">Sudán del Sur (+211)</option>
            <option value="+34">España (+34)</option>
            <option value="+94">Sri Lanka (+94)</option>
            <option value="+249">Sudán (+249)</option>
            <option value="+597">Surinam (+597)</option>
            <option value="+46">Suecia (+46)</option>
            <option value="+41">Suiza (+41)</option>
            <option value="+963">Siria (+963)</option>
            <option value="+886">Taiwán (+886)</option>
            <option value="+992">Tayikistán (+992)</option>
            <option value="+255">Tanzania (+255)</option>
            <option value="+66">Tailandia (+66)</option>
            <option value="+670">Timor Oriental (+670)</option>
            <option value="+228">Togo (+228)</option>
            <option value="+690">Tokelau (+690)</option>
            <option value="+676">Tonga (+676)</option>
            <option value="+1-868">Trinidad y Tobago (+1-868)</option>
            <option value="+216">Túnez (+216)</option>
            <option value="+90">Turquía (+90)</option>
            <option value="+993">Turkmenistán (+993)</option>
            <option value="+1-649">Islas Turcas y Caicos (+1-649)</option>
            <option value="+688">Tuvalu (+688)</option>
            <option value="+256">Uganda (+256)</option>
            <option value="+380">Ucrania (+380)</option>
            <option value="+971">EAU (+971)</option>
            <option value="+44">Reino Unido (+44)</option>
            <option value="+1">Estados Unidos (+1)</option>
            <option value="+598">Uruguay (+598)</option>
            <option value="+998">Uzbekistán (+998)</option>
            <option value="+678">Vanuatu (+678)</option>
            <option value="+39">Vaticano (+39)</option>
            <option value="+58">Venezuela (+58)</option>
            <option value="+84">Vietnam (+84)</option>
            <option value="+681">Wallis y Futuna (+681)</option>
            <option value="+967">Yemen (+967)</option>
            <option value="+260">Zambia (+260)</option>
            <option value="+263">Zimbabue (+263)</option>
          </select>

          <Input
            id="c-celular"
            name="celular"
            type="tel"
            placeholder="Celular"
            autoComplete="tel-national"
            className="input-soft rounded-xl"
            required
          />
        </div>

        {/* Mensaje */}
        <div className="login-field">
          <Textarea
            id="c-mensaje"
            name="mensaje"
            placeholder="Mensaje"
            rows={4}
            className="input-soft rounded-xl"
          />
        </div>

        {/* Política de tratamiento y protección de datos (requerida) */}
        <div className="login-field policy-row">
          <input
            id="c-politica"
            name="acepta_politica"
            type="checkbox"
            className="policy-checkbox"
            required
          />
          <label htmlFor="c-politica">
            Acepto la{" "}
            <a href="/politica" target="_blank" rel="noopener noreferrer" className="policy-link">
              Política de tratamiento y protección de datos personales
            </a>.
          </label>
        </div>

        {/* Botón compacto y centrado */}
        <div className="login-btn-row">
          <Button variant="accent" type="submit" className="login-btn-compact">
            Enviar
          </Button>
        </div>
      </form>
    </Card>
  );
}